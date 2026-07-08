import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { spawn } from "child_process";
import fs from "fs";
import dns from "dns";
import parsePhoneNumber from "libphonenumber-js";

const app = express();
const PORT = 3000;

app.use(express.json());

const DOWNLOADS_DIR = path.join(process.cwd(), "downloads");
const METADATA_PATH = path.join(DOWNLOADS_DIR, "metadata.json");

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Ensure metadata.json exists
if (!fs.existsSync(METADATA_PATH)) {
  fs.writeFileSync(METADATA_PATH, JSON.stringify({}), "utf-8");
}

interface DownloadRecord {
  id: string;
  title: string;
  filename: string;
  ext: string;
  mode: string;
  quality: string;
  size: number;
  originalUrl: string;
  thumbnail: string;
  addedAt: string;
}

interface Task {
  id: string;
  status: "pending" | "downloading" | "completed" | "failed";
  progress: number;
  speed: string;
  eta: string;
  error?: string;
  title: string;
  filename?: string;
}

const activeTasks: Record<string, Task> = {};

// Helper to read download history
function getDownloadRecords(): Record<string, DownloadRecord> {
  try {
    const data = fs.readFileSync(METADATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

// Helper to write download history
function saveDownloadRecord(record: DownloadRecord) {
  try {
    const records = getDownloadRecords();
    records[record.id] = record;
    fs.writeFileSync(METADATA_PATH, JSON.stringify(records, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save download record:", err);
  }
}

// Helper to delete download history
function deleteDownloadRecord(id: string) {
  try {
    const records = getDownloadRecords();
    const rec = records[id];
    if (rec) {
      const filePath = path.join(DOWNLOADS_DIR, rec.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      delete records[id];
      fs.writeFileSync(METADATA_PATH, JSON.stringify(records, null, 2), "utf-8");
      return true;
    }
  } catch (err) {
    console.error("Failed to delete download record:", err);
  }
  return false;
}

// ==========================================
// API Endpoints
// ==========================================

const COOKIES_PATH = path.join(DOWNLOADS_DIR, "cookies.txt");

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Cookie endpoints
app.get("/api/download/cookies/status", (req, res) => {
  const exists = fs.existsSync(COOKIES_PATH);
  if (exists) {
    try {
      const stats = fs.statSync(COOKIES_PATH);
      res.json({
        configured: true,
        size: stats.size,
        updatedAt: stats.mtime.toISOString(),
      });
    } catch (err) {
      res.json({ configured: true, size: 0, updatedAt: new Date().toISOString() });
    }
  } else {
    res.json({ configured: false });
  }
});

app.post("/api/download/cookies", (req, res) => {
  const { content } = req.body;
  if (!content || typeof content !== "string") {
    res.status(400).json({ error: "Cookie content is required" });
    return;
  }

  try {
    fs.writeFileSync(COOKIES_PATH, content.trim(), "utf-8");
    res.json({ success: true, message: "Cookies saved successfully." });
  } catch (err) {
    res.status(500).json({ error: `Failed to save cookies: ${(err as Error).message}` });
  }
});

app.delete("/api/download/cookies", (req, res) => {
  try {
    if (fs.existsSync(COOKIES_PATH)) {
      fs.unlinkSync(COOKIES_PATH);
      res.json({ success: true, message: "Cookies cleared successfully." });
    } else {
      res.json({ success: true, message: "No cookies file to delete." });
    }
  } catch (err) {
    res.status(500).json({ error: `Failed to delete cookies: ${(err as Error).message}` });
  }
});

// 1. Get Download History
app.get("/api/download/list", (req, res) => {
  const records = getDownloadRecords();
  res.json(Object.values(records).sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()));
});

// 2. Extract Metadata Info from URL
app.post("/api/download/info", (req, res) => {
  const { url } = req.body;
  if (!url) {
    res.status(400).json({ error: "URL is required" });
    return;
  }

  console.log(`Extracting info for URL: ${url}`);
  
  // Spawn yt-dlp to get JSON representation of the video
  const args = ["./yt-dlp", "-J", "--no-playlist", "--impersonate", "chrome", "--js-runtimes", "node"];
  if (fs.existsSync(COOKIES_PATH)) {
    args.push("--cookies", COOKIES_PATH);
  }
  args.push(url);

  const child = spawn("python3", args);

  let stdoutData = "";
  let stderrData = "";

  child.stdout.on("data", (data) => {
    stdoutData += data.toString();
  });

  child.stderr.on("data", (data) => {
    stderrData += data.toString();
  });

  child.on("close", (code) => {
    if (code !== 0) {
      console.error(`yt-dlp process exited with code ${code}. Error: ${stderrData}`);
      
      let errorMsg = "Failed to fetch video information. Ensure the URL is valid.";
      if (stderrData.includes("This post may not be comfortable for some audiences") || stderrData.includes("Log in for access")) {
        errorMsg = "This video is age-restricted or sensitive. Please upload/paste your cookies in the Settings / Cookies tab to unlock access.";
      } else if (stderrData.includes("Sign in to confirm") || stderrData.includes("confirm you’re not a bot") || stderrData.includes("confirm you're not a bot")) {
        errorMsg = "Request blocked by anti-bot verification. Please export your browser's Netscape cookies and inject them in the Cookies tab to bypass this.";
      } else if (stderrData.includes("Sign in to confirm your age") || stderrData.includes("confirm your age")) {
        errorMsg = "Age verification required by the platform. Please upload/paste cookies in the Settings / Cookies tab to bypass this.";
      } else if (stderrData.includes("Private video") || stderrData.includes("is private")) {
        errorMsg = "This video is private. If you have permission, please upload or paste valid Netscape cookies in the Settings / Cookies tab.";
      } else if (stderrData.includes("Unsupported URL")) {
        errorMsg = "Unsupported platform or invalid URL. Ensure the link points to a supported video/audio source.";
      } else if (stderrData.includes("Incomplete YouTube cookies") || stderrData.includes("invalid cookies") || stderrData.includes("CookieParseException")) {
        errorMsg = "Your uploaded cookies.txt file appears to be invalid or expired. Please export fresh cookies and re-upload.";
      } else if (stderrData.includes("impersonation")) {
        errorMsg = "Platform blocking request (unrecognized user agent/impersonation error). Try uploading standard cookies.";
      } else {
        const errorLines = stderrData.split("\n").filter(line => line.includes("ERROR:"));
        if (errorLines.length > 0) {
          errorMsg = errorLines[0].replace(/ERROR:\s*\[[^\]]+\]\s*/, "Platform Error: ").trim();
        }
      }

      res.status(500).json({ error: errorMsg });
      return;
    }

    try {
      const info = JSON.parse(stdoutData);
      
      // Map relevant formats
      const formats = (info.formats || []).map((f: any) => ({
        formatId: f.format_id,
        ext: f.ext,
        resolution: f.resolution || f.height ? `${f.height}p` : "unknown",
        filesize: f.filesize || f.filesize_approx || 0,
        note: f.format_note || "",
        vcodec: f.vcodec || "",
        acodec: f.acodec || "",
      })).filter((f: any) => f.resolution !== "unknown" || f.filesize > 0);

      res.json({
        id: info.id || String(Date.now()),
        title: info.title || "Unknown Title",
        duration: info.duration || 0,
        thumbnail: info.thumbnail || "",
        uploader: info.uploader || "Unknown",
        description: info.description || "",
        formats: formats.slice(0, 30), // Limit list to first 30 suitable formats
        originalUrl: url,
        webpage_url: info.webpage_url || url,
      });
    } catch (parseErr) {
      console.error("JSON parsing error for yt-dlp output:", parseErr);
      res.status(500).json({ error: "Failed to parse video info response." });
    }
  });
});

// 3. Start Download Task
app.post("/api/download/start", (req, res) => {
  const { url, mode, quality, formatId } = req.body;
  if (!url) {
    res.status(400).json({ error: "URL is required" });
    return;
  }

  const taskId = `task_${Date.now()}`;
  activeTasks[taskId] = {
    id: taskId,
    status: "pending",
    progress: 0,
    speed: "0 B/s",
    eta: "--:--",
    title: "Initializing...",
  };

  // Run in background
  const args = ["./yt-dlp", "--no-playlist", "--impersonate", "chrome", "--js-runtimes", "node"];
  if (fs.existsSync(COOKIES_PATH)) {
    args.push("--cookies", COOKIES_PATH);
  }

  // Formats selection
  if (mode === "audio") {
    args.push("-f", "bestaudio/best");
    args.push("-x", "--audio-format", "mp3", "--audio-quality", "192K");
  } else if (formatId) {
    // If exact format selected
    args.push("-f", `${formatId}+bestaudio/best`);
  } else {
    // Standard quality mapping
    if (quality === "best") {
      args.push("-f", "best[ext=mp4]/bestvideo+bestaudio/best");
    } else {
      args.push("-f", `best[ext=mp4][height<=${quality}]/bestvideo[height<=${quality}]+bestaudio/best`);
    }
  }

  // Define dynamic output pattern with ID
  const fileId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  args.push("-o", path.join(DOWNLOADS_DIR, `${fileId}.%(ext)s`));
  args.push(url);

  console.log(`Starting download task ${taskId} with args:`, args);
  const child = spawn("python3", args);

  activeTasks[taskId].status = "downloading";

  child.stdout.on("data", (data) => {
    const line = data.toString();
    
    // Parse title if printed
    if (line.includes("[download] Destination:")) {
      const match = line.match(/Destination:\s+(.*)/);
      if (match) {
        const dest = match[1];
        activeTasks[taskId].title = path.basename(dest);
      }
    }

    // Parse progress logs
    // Example: [download]  12.3% of 45.67MiB at  1.23MiB/s ETA 00:30
    const progressMatch = line.match(/\[download\]\s+(\d+\.\d+)%\s+of\s+(\S+)\s+at\s+(\S+)\s+ETA\s+(\S+)/);
    if (progressMatch) {
      activeTasks[taskId].progress = parseFloat(progressMatch[1]);
      activeTasks[taskId].speed = progressMatch[3];
      activeTasks[taskId].eta = progressMatch[4];
    }
  });

  let taskStderr = "";
  child.stderr.on("data", (data) => {
    taskStderr += data.toString();
    console.error(`[Task ${taskId} stderr]:`, data.toString());
  });

  child.on("close", (code) => {
    if (code !== 0) {
      activeTasks[taskId].status = "failed";
      
      let errorMsg = `Download failed with exit code ${code}`;
      if (taskStderr.includes("This post may not be comfortable for some audiences") || taskStderr.includes("Log in for access")) {
        errorMsg = "Age-restricted/sensitive post. Please configure and load your cookies in Settings / Cookies tab.";
      } else if (taskStderr.includes("Sign in to confirm") || taskStderr.includes("confirm you’re not a bot") || taskStderr.includes("confirm you're not a bot")) {
        errorMsg = "Request blocked by anti-bot verification. Please export your browser's Netscape cookies and inject them in the Cookies tab to bypass this.";
      } else if (taskStderr.includes("Sign in to confirm your age") || taskStderr.includes("confirm your age")) {
        errorMsg = "Platform age-verification required. Use cookies in Settings / Cookies tab to download.";
      } else if (taskStderr.includes("Private video") || taskStderr.includes("is private")) {
        errorMsg = "Private content. Please configure cookies in Settings / Cookies tab to download.";
      } else if (taskStderr.includes("Incomplete YouTube cookies") || taskStderr.includes("invalid cookies") || taskStderr.includes("CookieParseException")) {
        errorMsg = "Expired or invalid cookies.txt. Export fresh cookies and try again.";
      } else if (taskStderr.includes("impersonation")) {
        errorMsg = "Platform blocking request (impersonation error). Please try uploading standard cookies.";
      } else {
        const errorLines = taskStderr.split("\n").filter(line => line.includes("ERROR:"));
        if (errorLines.length > 0) {
          errorMsg = errorLines[0].replace(/ERROR:\s*\[[^\]]+\]\s*/, "").trim();
        }
      }
      
      activeTasks[taskId].error = errorMsg;
      console.error(`Task ${taskId} failed with exit code ${code}`);
      return;
    }

    // Find the downloaded file
    try {
      const files = fs.readdirSync(DOWNLOADS_DIR);
      const matchedFile = files.find(f => f.startsWith(fileId));
      if (matchedFile) {
        const ext = path.extname(matchedFile).substring(1);
        const stats = fs.statSync(path.join(DOWNLOADS_DIR, matchedFile));

        // Get pretty title using yt-dlp metadata fast
        const titleArgs = ["./yt-dlp", "--get-title", "--no-playlist", "--impersonate", "chrome", url];
        if (fs.existsSync(COOKIES_PATH)) {
          titleArgs.push("--cookies", COOKIES_PATH);
        }
        const titleProc = spawn("python3", titleArgs);
        let prettyTitle = "Downloaded Video";
        
        titleProc.stdout.on("data", (data) => {
          prettyTitle = data.toString().trim();
        });

        titleProc.on("close", () => {
          const record: DownloadRecord = {
            id: fileId,
            title: prettyTitle || "Untitled Media",
            filename: matchedFile,
            ext: ext,
            mode: mode || "video",
            quality: quality || "best",
            size: stats.size,
            originalUrl: url,
            thumbnail: "",
            addedAt: new Date().toISOString(),
          };

          saveDownloadRecord(record);

          activeTasks[taskId].status = "completed";
          activeTasks[taskId].progress = 100;
          activeTasks[taskId].filename = matchedFile;
          activeTasks[taskId].title = prettyTitle;
        });
      } else {
        activeTasks[taskId].status = "failed";
        activeTasks[taskId].error = "Could not locate completed download file.";
      }
    } catch (err) {
      activeTasks[taskId].status = "failed";
      activeTasks[taskId].error = `Finalizing error: ${(err as Error).message}`;
    }
  });

  res.json({ taskId });
});

// 4. Get Task Progress/Status
app.get("/api/download/status/:taskId", (req, res) => {
  const { taskId } = req.params;
  const task = activeTasks[taskId];
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(task);
});

// 5. Download Served File with Content-Disposition
app.get("/api/download/file/:id", (req, res) => {
  const { id } = req.params;
  const records = getDownloadRecords();
  const rec = records[id];

  if (!rec) {
    res.status(404).json({ error: "File record not found" });
    return;
  }

  const filePath = path.join(DOWNLOADS_DIR, rec.filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found on disk" });
    return;
  }

  // Set the Content-Disposition header so it downloads with its original title
  const safeTitle = rec.title.replace(/[/\\?%*:|"<>\s]+/g, "_") + "." + rec.ext;
  res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(safeTitle)}"`);
  res.sendFile(filePath);
});

// 6. Delete Download Record and File
app.delete("/api/download/file/:id", (req, res) => {
  const { id } = req.params;
  const deleted = deleteDownloadRecord(id);
  if (deleted) {
    res.json({ success: true, message: "File deleted successfully" });
  } else {
    res.status(404).json({ error: "File not found or failed to delete" });
  }
});

// ==========================================
// Network Tools (Mode Ultra) Endpoints
// ==========================================

// 7. IP Address Lookup
app.post("/api/network/ip", async (req, res) => {
  const { ip } = req.body;
  if (!ip) {
    res.status(400).json({ error: "IP address is required" });
    return;
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip.trim()}/json/`);
    if (!response.ok) {
      res.status(500).json({ error: `API request failed with status ${response.status}` });
      return;
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: `Failed to lookup IP: ${(err as Error).message}` });
  }
});

// 8. Phone Number Analysis
app.post("/api/network/phone", (req, res) => {
  const { phone, defaultRegion } = req.body;
  if (!phone) {
    res.status(400).json({ error: "Phone number is required" });
    return;
  }

  try {
    const phoneNumber = parsePhoneNumber(phone.trim(), defaultRegion || "ID");
    if (!phoneNumber) {
      res.status(400).json({ error: "Failed to parse phone number" });
      return;
    }

    res.json({
      input: phone,
      isValid: phoneNumber.isValid(),
      number: phoneNumber.number,
      country: phoneNumber.country,
      countryCallingCode: phoneNumber.countryCallingCode,
      nationalNumber: phoneNumber.nationalNumber,
      type: phoneNumber.getType() || "UNKNOWN",
    });
  } catch (err) {
    res.status(400).json({ error: `Failed to analyze phone number: ${(err as Error).message}` });
  }
});

// 9. DNS Lookup / Hostname Resolver
app.post("/api/network/dns", (req, res) => {
  const { hostname } = req.body;
  if (!hostname) {
    res.status(400).json({ error: "Hostname is required" });
    return;
  }

  dns.resolve4(hostname.trim(), (err, addresses) => {
    if (err) {
      res.status(500).json({ error: `DNS Resolution failed: ${err.message}` });
      return;
    }
    res.json({ hostname, addresses });
  });
});

// ==========================================
// Vite Dev Server Middleware & Asset Pipeline
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[UltraProMax] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
