import { useState, useEffect, useRef } from "react";
import { 
  Download, Search, Globe, Phone, Terminal, Cpu, Layers, Wifi, Trash2, 
  Video, Music, AlertTriangle, CheckCircle, Server, Activity, FileText, 
  RefreshCw, Clock, ExternalLink, Play, Sparkles, Network, HelpCircle, 
  X, Check, ShieldAlert, Sparkle, ArrowRight, CornerDownRight, MapPin, 
  ChevronRight, Compass, Flame, HardDrive, Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ParticleBackground from "./components/ParticleBackground";
import MatrixRain from "./components/MatrixRain";
import { 
  DownloadRecord, VideoInfo, TaskStatus, IpLookupResult, 
  PhoneAnalysisResult, DnsResult 
} from "./types";

interface LogMessage {
  id: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error" | "command";
  text: string;
}

interface ToastMessage {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
}

export default function App() {
  // Loading & splash screen states
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStepText, setBootStepText] = useState("INITIALIZING SECURE SYSTEM SHELL...");

  // Theme, tab, and navigation state
  const [activeTab, setActiveTab] = useState<"downloader" | "network" | "library" | "cookies">("downloader");
  const [networkSubTab, setNetworkSubTab] = useState<"ip" | "phone" | "dns">("ip");
  const [showMatrix, setShowMatrix] = useState(true);
  
  // Custom interactive cursor / follow glow
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Floating notifications/toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // System console logs
  const [logs, setLogs] = useState<LogMessage[]>([
    { id: "1", timestamp: "10:17:00", type: "info", text: "Initializing UltraProMax v7.1 HYPER CORE..." },
    { id: "2", timestamp: "10:17:01", type: "info", text: "Verifying python-based standalone yt-dlp layer..." },
    { id: "3", timestamp: "10:17:02", type: "success", text: "yt-dlp compiled successfully (v2026.07.04)." },
    { id: "4", timestamp: "10:17:03", type: "success", text: "Network diagnostics telemetry: ONLINE." },
  ]);
  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  // Downloader input states
  const [url, setUrl] = useState("");
  const [detectedPlatform, setDetectedPlatform] = useState("Unknown/yt-dlp");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [downloadMode, setDownloadMode] = useState<"video" | "audio">("video");
  const [videoQuality, setVideoQuality] = useState<string>("best");
  
  // Download task monitor state
  const [activeTask, setActiveTask] = useState<TaskStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Cloud library / history states
  const [history, setHistory] = useState<DownloadRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Network sub-tab input states
  const [ipInput, setIpInput] = useState("");
  const [isIpLoading, setIsIpLoading] = useState(false);
  const [ipResult, setIpResult] = useState<IpLookupResult | null>(null);

  const [phoneInput, setPhoneInput] = useState("");
  const [phoneRegion, setPhoneRegion] = useState("ID");
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [phoneResult, setPhoneResult] = useState<PhoneAnalysisResult | null>(null);

  const [dnsInput, setDnsInput] = useState("");
  const [isDnsLoading, setIsDnsLoading] = useState(false);
  const [dnsResult, setDnsResult] = useState<DnsResult | null>(null);

  // Cookies authentication state variables
  const [cookiesConfigured, setCookiesConfigured] = useState(false);
  const [cookiesInfo, setCookiesInfo] = useState<{ size: number; updatedAt: string } | null>(null);
  const [cookiesContent, setCookiesContent] = useState("");
  const [isSavingCookies, setIsSavingCookies] = useState(false);
  const [isCheckingCookies, setIsCheckingCookies] = useState(false);

  // Real-time server diagnostics stats
  const [stats, setStats] = useState({
    uptime: "2h 45m",
    totalSize: "0 B",
    downloadCount: 0,
    pingTime: 21,
  });

  // Custom multi-stage boot sequence helper
  useEffect(() => {
    const totalDuration = 1800; // ms
    const intervalTime = 30;
    const stepCount = totalDuration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / stepCount) * 100, 100);
      setBootProgress(progress);

      if (progress < 30) {
        setBootStepText("DECRYPTING STANDALONE MEDIA KERNELS...");
      } else if (progress < 65) {
        setBootStepText("RE-STABILIZING STANDALONE GRAPHICAL PIPELINES...");
      } else if (progress < 90) {
        setBootStepText("TUNING GEOIP INTERACTIVE DICTIONARIES...");
      } else {
        setBootStepText("ESTABLISHING HIGH-PERFORMANCE INTERFACES...");
      }

      if (currentStep >= stepCount) {
        clearInterval(interval);
        setBooting(false);
        showToast("success", "System Ready", "UltraProMax Hyper Engine is fully calibrated.");
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  // Tracking mouse movement for neon spotlights
  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, []);

  // System console logger helper
  const addLog = (text: string, type: LogMessage["type"] = "info") => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setLogs((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), timestamp: timeStr, type, text }
    ]);
  };

  // Toast notifier helper
  const showToast = (type: ToastMessage["type"], title: string, message: string) => {
    const id = String(Date.now());
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Auto-scroll logic for Hacker Terminal Console
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Ping telemetry simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        pingTime: Math.floor(Math.random() * 8) + 18,
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto detect platform based on URL patterns
  useEffect(() => {
    const u = url.toLowerCase();
    if (!u) {
      setDetectedPlatform("Unknown/yt-dlp");
      return;
    }
    
    const platforms = [
      { name: "TikTok", keys: ["tiktok.com", "vt.tiktok.com", "vm.tiktok.com", "t.tiktok.com"] },
      { name: "Instagram", keys: ["instagram.com", "instagr.am"] },
      { name: "Facebook", keys: ["facebook.com", "fb.watch", "m.facebook.com"] },
      { name: "Twitter/X", keys: ["twitter.com", "x.com", "x.co"] },
      { name: "YouTube", keys: ["youtube.com", "youtu.be"] },
      { name: "CapCut", keys: ["capcut.com"] },
      { name: "Reddit", keys: ["reddit.com"] },
      { name: "Pinterest", keys: ["pinterest.com"] }
    ];

    const match = platforms.find(p => p.keys.some(k => u.includes(k)));
    if (match) {
      setDetectedPlatform(match.name);
    } else {
      setDetectedPlatform("Generic Web Target");
    }
  }, [url]);

  // Load cloud library histories from filesystem endpoint
  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/download/list");
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
        
        // Humanize size totals
        const count = data.length;
        const sizeBytes = data.reduce((acc: number, item: any) => acc + (item.size || 0), 0);
        let humanSize = "0 B";
        if (sizeBytes > 0) {
          const units = ["B", "KB", "MB", "GB", "TB"];
          let s = sizeBytes;
          let idx = 0;
          while (s >= 1024 && idx < units.length - 1) {
            s /= 1024;
            idx++;
          }
          humanSize = `${s.toFixed(1)} ${units[idx]}`;
        }
        setStats(prev => ({ ...prev, downloadCount: count, totalSize: humanSize }));
      }
    } catch (err) {
      addLog("Failed to sync downloads database library", "error");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const checkCookiesStatus = async () => {
    setIsCheckingCookies(true);
    try {
      const res = await fetch("/api/download/cookies/status");
      if (res.ok) {
        const data = await res.json();
        setCookiesConfigured(data.configured);
        if (data.configured) {
          setCookiesInfo({ size: data.size, updatedAt: data.updatedAt });
        } else {
          setCookiesInfo(null);
        }
      }
    } catch (err) {
      console.error("Failed to check cookies status", err);
    } finally {
      setIsCheckingCookies(false);
    }
  };

  const handleSaveCookies = async () => {
    if (!cookiesContent.trim()) {
      showToast("warning", "Empty Payload", "Please enter Netscape format cookies text.");
      return;
    }
    setIsSavingCookies(true);
    addLog("Saving uploaded credentials/cookies configuration on disk...", "command");
    try {
      const res = await fetch("/api/download/cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: cookiesContent }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Cookies Configuration Mapped", "Active authentication credentials updated.");
        addLog("Secure cookies payload successfully saved & decrypted.", "success");
        setCookiesContent("");
        checkCookiesStatus();
      } else {
        showToast("error", "Failed To Save Credentials", data.error || "Encryption failed.");
        addLog(`Cookies registration error: ${data.error}`, "error");
      }
    } catch (err) {
      addLog(`Network credential exception: ${(err as Error).message}`, "error");
    } finally {
      setIsSavingCookies(false);
    }
  };

  const handleDeleteCookies = async () => {
    if (!window.confirm("Are you sure you want to clear saved cookies credentials? This might restrict downloading protected content.")) return;
    addLog("Wiping registered cookies credentials...", "command");
    try {
      const res = await fetch("/api/download/cookies", { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showToast("info", "Cookies Erased", "Successfully purged session credentials.");
        addLog("Saved Netscape session cookies deleted.", "success");
        checkCookiesStatus();
      } else {
        addLog(`Purge error: ${data.error}`, "error");
      }
    } catch (err) {
      addLog(`Purge failed: ${(err as Error).message}`, "error");
    }
  };

  useEffect(() => {
    loadHistory();
    checkCookiesStatus();
  }, []);

  // Fetch / extract media stream metadata from server
  const handleExtract = async () => {
    if (!url.trim()) return;
    setIsExtracting(true);
    setExtractedInfo(null);
    addLog(`Decrypting server stream meta payload for target URL: ${url.substring(0, 48)}...`, "command");
    showToast("info", "Extracting Streams", "Connecting with remote servers to fetch stream formats...");

    try {
      const res = await fetch("/api/download/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setExtractedInfo(data);
        addLog(`Successfully decrypted stream matrix: "${data.title}"`, "success");
        showToast("success", "Stream Extracted", `Successfully loaded format maps for: ${data.title.substring(0, 30)}...`);
        if (data.formats && data.formats.length > 0) {
          setSelectedFormat(data.formats[0].formatId);
        }
      } else {
        addLog(data.error || "Failed to extract streams. Host could be protected.", "error");
        showToast("error", "Extraction Failed", data.error || "Ensure the target URL is correct.");
      }
    } catch (err) {
      addLog(`Extraction connection error: ${(err as Error).message}`, "error");
    } finally {
      setIsExtracting(false);
    }
  };

  // Start download tasks asynchronously
  const handleStartDownload = async (customFormatId?: string) => {
    const targetUrl = url || (extractedInfo ? extractedInfo.originalUrl : "");
    if (!targetUrl) {
      addLog("Please specify a valid media stream payload URL", "warning");
      return;
    }

    addLog(`Deploying isolated download sub-process threads...`, "command");
    showToast("info", "Starting Pipeline", "Allocating hardware cache threads for immediate download...");
    try {
      const res = await fetch("/api/download/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          mode: downloadMode,
          quality: videoQuality,
          formatId: customFormatId || selectedFormat,
        }),
      });
      const data = await res.json();
      if (res.ok && data.taskId) {
        addLog(`Sub-process spawned. Tracking PID: ${data.taskId}`, "info");
        pollTaskStatus(data.taskId);
      } else {
        addLog(data.error || "Failed to initialize active storage downloader", "error");
        showToast("error", "Task Initialization Failed", data.error || "Could not spawn daemon process.");
      }
    } catch (err) {
      addLog(`Daemon deployment socket error: ${(err as Error).message}`, "error");
    }
  };

  // Poll background task download daemon updates
  const pollTaskStatus = (taskId: string) => {
    setIsPolling(true);
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/download/status/${taskId}`);
        if (res.ok) {
          const task: TaskStatus = await res.json();
          setActiveTask(task);

          if (task.status === "completed") {
            addLog(`Active pipeline stream successfully closed! Title: ${task.title}`, "success");
            showToast("success", "Download Complete", `File saved successfully: ${task.title.substring(0, 30)}...`);
            
            // Trigger 3s celebration visuals
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 4000);

            clearInterval(interval);
            setIsPolling(false);
            setActiveTask(null);
            loadHistory();
          } else if (task.status === "failed") {
            addLog(`Sub-process thread failed: ${task.error}`, "error");
            showToast("error", "Process Interrupted", task.error || "Critical download error.");
            clearInterval(interval);
            setIsPolling(false);
            setActiveTask(null);
          }
        } else {
          clearInterval(interval);
          setIsPolling(false);
        }
      } catch (err) {
        clearInterval(interval);
        setIsPolling(false);
      }
    }, 1000);
  };

  // Purge file from Cloud Library
  const handleDeleteFile = async (id: string, name: string) => {
    addLog(`Executing storage purge protocol for file id: ${id}`, "command");
    try {
      const res = await fetch(`/api/download/file/${id}`, { method: "DELETE" });
      if (res.ok) {
        addLog(`Successfully purged object file "${name}" from server storage.`, "success");
        showToast("success", "Asset Deleted", "Successfully removed object metadata and media files.");
        loadHistory();
      } else {
        addLog("Failed to wipe specified object storage cache", "error");
      }
    } catch (err) {
      addLog("Storage wiping command interrupted.", "error");
    }
  };

  // GeoIP analysis request
  const handleIpLookup = async () => {
    const ip = ipInput.trim() || "8.8.8.8";
    setIsIpLoading(true);
    setIpResult(null);
    addLog(`Pinging GeoIP nameservers to analyze: ${ip}...`, "command");

    try {
      const res = await fetch("/api/network/ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.error) {
          addLog(`Server trace caution: ${data.error}`, "warning");
          setIpResult({ ip, error: data.reason || data.error });
        } else {
          setIpResult(data);
          addLog(`IP resolved: Country ${data.country_name || "N/A"} (${data.org || "N/A"})`, "success");
          showToast("success", "IP Geolocation Resolved", `Location: ${data.city || "N/A"}, ${data.country_name || "N/A"}`);
        }
      } else {
        addLog(data.error || "Failed to execute lookup.", "error");
      }
    } catch (err) {
      addLog(`Network trace error: ${(err as Error).message}`, "error");
    } finally {
      setIsIpLoading(false);
    }
  };

  // Telephony phone validation parser
  const handlePhoneLookup = async () => {
    if (!phoneInput.trim()) return;
    setIsPhoneLoading(true);
    setPhoneResult(null);
    addLog(`Warming phone analytics wrapper for payload: [${phoneInput}]...`, "command");

    try {
      const res = await fetch("/api/network/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneInput, defaultRegion: phoneRegion }),
      });
      const data = await res.json();
      if (res.ok) {
        setPhoneResult(data);
        if (data.isValid) {
          addLog(`Validated Phone Carrier Prefix successfully. Format: ${data.nationalNumber}`, "success");
          showToast("success", "Telephony Parsed", `Prefix matches country: ${data.country}`);
        } else {
          addLog(`Telephony structural warning: Input payload doesn't fit ITU-T recommendations.`, "warning");
          showToast("warning", "Structure Alert", "The phone string format could be invalid.");
        }
      } else {
        addLog(data.error || "Telephony parsing logic exception.", "error");
      }
    } catch (err) {
      addLog(`Telephony network error: ${(err as Error).message}`, "error");
    } finally {
      setIsPhoneLoading(false);
    }
  };

  // DNS nameserver query logic
  const handleDnsLookup = async () => {
    if (!dnsInput.trim()) return;
    setIsDnsLoading(true);
    setDnsResult(null);
    addLog(`Initiating Nameserver lookup for: ${dnsInput}...`, "command");

    try {
      const res = await fetch("/api/network/dns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostname: dnsInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setDnsResult(data);
        addLog(`Successfully mapped hostname [${dnsInput}] to ${data.addresses.length} records.`, "success");
        showToast("success", "DNS Resolved", `Found ${data.addresses.length} host IPs.`);
      } else {
        addLog(data.error || "Nameserver query crashed.", "error");
        showToast("error", "DNS Resolving Error", data.error || "Verify hostname is alive.");
      }
    } catch (err) {
      addLog(`Nameserver network error: ${(err as Error).message}`, "error");
    } finally {
      setIsDnsLoading(false);
    }
  };

  // Pipe DNS record IP to Geolocation mapping
  const handleDnsIpLookup = (ip: string) => {
    setIpInput(ip);
    setNetworkSubTab("ip");
    addLog(`Piping Domain address record [${ip}] back to Geolocation tracer...`, "info");
    setTimeout(() => {
      handleIpLookup();
    }, 100);
  };

  // Quick action simulated triggers inside terminal console
  const handleConsoleShortcut = (action: string) => {
    if (action === "reboot") {
      addLog("REBOOT SEQUENCE INITIATED...", "command");
      setBootProgress(0);
      setBootStepText("RESETTING ALL ISOLATED APPLICATION CHANNELS...");
      setBooting(true);
      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setBooting(false);
            addLog("ALL APPLICATION CORE MODULES HAVE BEEN RECALIBRATED.", "success");
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    } else if (action === "clearcache") {
      addLog("WIPING LOCAL TELEMETRY BUFFER...", "command");
      setTimeout(() => {
        setLogs([
          { id: "1", timestamp: "10:17:00", type: "info", text: "Initializing UltraProMax v7.1 HYPER CORE..." },
          { id: "2", timestamp: "10:17:01", type: "success", text: "Local diagnostic logs flushed successfully." }
        ]);
        showToast("success", "Cache Purged", "Terminal console history cleared.");
      }, 300);
    } else if (action === "dbstatus") {
      addLog(`QUERYING PERSISTED DATABASE DIRECTORY: [${stats.totalSize}]`, "command");
      loadHistory();
    }
  };

  return (
    <div className="min-h-screen bg-[#07080f] text-gray-200 font-sans flex flex-col relative overflow-hidden select-none">
      
      {/* Dynamic Cyber Aurora Mesh Ambient Glow Background */}
      <ParticleBackground />
      {showMatrix && <MatrixRain />}

      {/* Futuristic Mouse cursor follower glow spotlight */}
      <div 
        className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-emerald-500/15 blur-[40px] z-50 transition-transform duration-75 mix-blend-screen"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Floating Animated Toast Notifications */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100] max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className="bg-[#0b0c15]/95 backdrop-blur-xl border border-gray-800 rounded-xl p-4 shadow-2xl flex gap-3 relative overflow-hidden group"
            >
              {/* Custom border highlight matching toast type */}
              <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                t.type === "success" ? "bg-emerald-500" :
                t.type === "error" ? "bg-rose-500" :
                t.type === "warning" ? "bg-amber-500" : "bg-cyan-500"
              }`} />

              <div className="flex-shrink-0 mt-0.5">
                {t.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {t.type === "error" && <ShieldAlert className="w-5 h-5 text-rose-400" />}
                {t.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {t.type === "info" && <Compass className="w-5 h-5 text-cyan-400" />}
              </div>

              <div className="flex-1">
                <h5 className="text-white text-xs font-bold font-sans uppercase tracking-wider">{t.title}</h5>
                <p className="text-gray-400 text-[11px] mt-1 font-mono leading-relaxed">{t.message}</p>
              </div>

              {/* Animated countdown bar helper */}
              <div className="absolute bottom-0 left-1 right-0 h-[2px] bg-gray-900 overflow-hidden">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4.5, ease: "linear" }}
                  className={`h-full ${
                    t.type === "success" ? "bg-emerald-500" :
                    t.type === "error" ? "bg-rose-500" :
                    t.type === "warning" ? "bg-amber-500" : "bg-cyan-500"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* System Boot Splash Screen Sequence Overlay */}
      <AnimatePresence>
        {booting && (
          <motion.div 
            className="fixed inset-0 bg-[#04050a] z-[1000] flex flex-col items-center justify-center p-6"
            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_60%)]" />
            <MatrixRain />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md w-full text-center flex flex-col items-center relative z-10"
            >
              {/* Rotating glowing core logo animation */}
              <div className="relative mb-6">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="w-16 h-16 rounded-xl border-2 border-dashed border-emerald-500/40 flex items-center justify-center p-4"
                >
                  <Cpu className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <div className="absolute inset-0 w-16 h-16 rounded-xl bg-emerald-500/10 filter blur-xl animate-pulse" />
              </div>

              <h2 className="text-xl font-bold font-sans tracking-widest text-white">ULTRAPROMAX V7.1</h2>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">Standalone Cyber Core Boot Sequence</p>

              {/* Progress percentage and progress tracks */}
              <div className="w-full mt-8 bg-gray-950 border border-gray-900 rounded-full h-2 overflow-hidden p-[2px]">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-purple-500 rounded-full"
                  style={{ width: `${bootProgress}%` }}
                />
              </div>

              <div className="flex justify-between items-center w-full mt-3 font-mono text-[10px] text-gray-400">
                <span className="animate-pulse">{bootStepText}</span>
                <span className="text-emerald-400 font-bold">{Math.floor(bootProgress)}%</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Master Success Celebration Confetti Particle Burst Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-emerald-500/[0.04] backdrop-blur-[2px] transition-all" />
            <motion.div 
              initial={{ scale: 0.8, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-[#0b0c15]/90 border border-emerald-500/40 p-8 rounded-3xl text-center shadow-3xl max-w-sm flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                <Check className="w-8 h-8 text-emerald-400 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wider font-sans uppercase">Pipeline Closed</h3>
                <p className="text-xs text-emerald-400 font-mono mt-1">100% Stream Frame Packets Decrypted</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Glassmorphic Command Panel */}
      <header className="border-b border-gray-900/60 bg-[#07080f]/75 backdrop-blur-2xl sticky top-0 z-40 px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-25 filter blur-lg group-hover:opacity-40 transition-opacity" />
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-center relative">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-widest text-white font-sans flex items-center gap-2">
              ULTRAPROMAX <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">V7.1 HYPER</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-wider">UNIVERSAL DECRYPTER & NETWORK DIAGNOSTICATOR</p>
          </div>
        </div>

        {/* Dynamic system health telemetry bar */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-950/60 border border-gray-900">
            <Wifi className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-gray-500">PING: <strong className="text-cyan-400 font-bold">{stats.pingTime}ms</strong></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-950/60 border border-gray-900">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-gray-500">UPTIME: <strong className="text-purple-400 font-bold">{stats.uptime}</strong></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-950/60 border border-gray-900">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-500">WIPED SPACE: <strong className="text-emerald-400 font-bold">{stats.totalSize}</strong></span>
          </div>
          <button 
            onClick={() => {
              setShowMatrix(!showMatrix);
              addLog(`Matrix backdrop changed: ${!showMatrix ? "ON" : "OFF"}`, "info");
            }}
            className={`cursor-pointer px-3 py-1.5 rounded-xl border text-[10px] uppercase font-bold tracking-widest transition-all ${
              showMatrix 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20" 
                : "bg-gray-900/40 border-gray-800 text-gray-500 hover:bg-gray-800"
            }`}
          >
            Matrix: {showMatrix ? "ON" : "OFF"}
          </button>
        </div>
      </header>

      {/* Cyber Premium Hero Title Display */}
      <section className="text-center py-8 px-4 max-w-4xl mx-auto relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-emerald-500/5 filter blur-[100px] rounded-full pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] text-emerald-400 font-mono uppercase tracking-widest">
            <Sparkle className="w-3 h-3 animate-spin" />
            <span>Standalone Web Platform Calibrated</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-sans tracking-tight text-white mt-3 leading-none">
            Next-Gen Cyber <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">Engine Matrix</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl font-mono mt-4 leading-relaxed">
            Unleash hyper-optimized media stream downloads and interactive network intelligence parsing. Hand-crafted, seamless, and completely secure.
          </p>
        </motion.div>
      </section>

      {/* Main Core Section Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-start">
        
        {/* LEFT COLUMN PANEL: TAB MATRIX CONTROLLER & ACTIONS (8 COLS) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Futuristic Magnetic Floating Glass Tab Selector */}
          <div className="flex border border-gray-900/60 bg-[#07080f]/80 p-1.5 rounded-2xl backdrop-blur-xl relative">
            <button
              onClick={() => setActiveTab("downloader")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider font-sans transition-all relative z-10 cursor-pointer ${
                activeTab === "downloader" ? "text-emerald-400" : "text-gray-500 hover:text-white"
              }`}
            >
              {activeTab === "downloader" && (
                <motion.div 
                  layoutId="activeTabOutline"
                  className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 rounded-xl z-[-1]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Download className="w-4 h-4" />
              <span>Downloader</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("network");
                loadHistory();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider font-sans transition-all relative z-10 cursor-pointer ${
                activeTab === "network" ? "text-cyan-400" : "text-gray-500 hover:text-white"
              }`}
            >
              {activeTab === "network" && (
                <motion.div 
                  layoutId="activeTabOutline"
                  className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded-xl z-[-1]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Network className="w-4 h-4" />
              <span>Diagnostics</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("library");
                loadHistory();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider font-sans transition-all relative z-10 cursor-pointer ${
                activeTab === "library" ? "text-purple-400" : "text-gray-500 hover:text-white"
              }`}
            >
              {activeTab === "library" && (
                <motion.div 
                  layoutId="activeTabOutline"
                  className="absolute inset-0 bg-purple-500/10 border border-purple-500/30 rounded-xl z-[-1]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Layers className="w-4 h-4" />
              <span>Vault ({stats.downloadCount})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("cookies");
                checkCookiesStatus();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider font-sans transition-all relative z-10 cursor-pointer ${
                activeTab === "cookies" ? "text-amber-400" : "text-gray-500 hover:text-white"
              }`}
            >
              {activeTab === "cookies" && (
                <motion.div 
                  layoutId="activeTabOutline"
                  className="absolute inset-0 bg-amber-500/10 border border-amber-500/30 rounded-xl z-[-1]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <ShieldAlert className="w-4 h-4" />
              <span>Cookies</span>
            </button>
          </div>

          {/* Active Tab Panel with high-fidelity components */}
          <div className="flex-1 min-h-[460px]">
            <AnimatePresence mode="wait">
              {activeTab === "downloader" && (
                <motion.div
                  key="downloaderTab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  {/* Glassmorphic Media Extractor Panel */}
                  <div className="cyber-panel cyber-panel-green rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full filter blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold font-sans tracking-wide flex items-center gap-2 text-sm uppercase">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Decryption Gateway
                      </h3>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold tracking-widest uppercase">
                        {detectedPlatform}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 font-mono leading-relaxed mt-1">
                      Our standalone engine uses python-compiled daemon instances to strip protections and map raw direct media streams automatically.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <div className="relative flex-1">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="PASTE INSTAGRAM, TIKTOK, YOUTUBE OR TWITTER/X URL PAYLOAD..."
                          className="w-full bg-[#05060b] border border-gray-900 rounded-2xl px-4 py-4 text-xs focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-600 font-mono text-emerald-400 tracking-wider"
                        />
                        {url && (
                          <button 
                            onClick={() => setUrl("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={handleExtract}
                        disabled={isExtracting || !url}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-900/60 disabled:text-gray-600 text-white font-bold font-sans text-xs px-6 py-4 sm:py-0 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95"
                      >
                        {isExtracting ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        <span>ANALYZE</span>
                      </button>
                    </div>

                    {/* Mode Configuration presets */}
                    {!extractedInfo && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 mt-1 border-t border-gray-900/60">
                        <div className="bg-[#05060b]/60 border border-gray-900 rounded-2xl p-3 flex flex-col gap-1 text-center justify-center">
                          <span className="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-widest">Target Mode</span>
                          <div className="flex gap-2 justify-center mt-1.5">
                            <button 
                              onClick={() => setDownloadMode("video")}
                              className={`text-[10px] font-bold px-3 py-1 rounded-lg border font-mono transition-all ${
                                downloadMode === "video" 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                                  : "bg-transparent text-gray-500 border-transparent hover:text-gray-300"
                              }`}
                            >
                              VIDEO
                            </button>
                            <button 
                              onClick={() => setDownloadMode("audio")}
                              className={`text-[10px] font-bold px-3 py-1 rounded-lg border font-mono transition-all ${
                                downloadMode === "audio" 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                                  : "bg-transparent text-gray-500 border-transparent hover:text-gray-300"
                              }`}
                            >
                              AUDIO
                            </button>
                          </div>
                        </div>

                        <div className="bg-[#05060b]/60 border border-gray-900 rounded-2xl p-3 flex flex-col gap-1.5 text-center justify-center">
                          <span className="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-widest">Quality Preset</span>
                          <select 
                            value={videoQuality}
                            onChange={(e) => setVideoQuality(e.target.value)}
                            disabled={downloadMode === "audio"}
                            className="bg-[#05060b] border border-gray-900 rounded-lg py-1 px-2 text-[10px] text-emerald-400 font-mono font-bold focus:outline-none text-center"
                          >
                            <option value="best">BEST AVAILABLE</option>
                            <option value="1080">1080P FHD</option>
                            <option value="720">720P HD</option>
                            <option value="480">480P SD</option>
                          </select>
                        </div>

                        <div className="bg-[#05060b]/60 border border-gray-900 rounded-2xl p-3 flex flex-col gap-2 text-center justify-center">
                          <span className="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-widest">Direct Link Fire</span>
                          <button
                            onClick={() => handleStartDownload()}
                            disabled={!url || isPolling}
                            className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] py-1.5 font-bold font-mono tracking-wider transition-all disabled:opacity-30"
                          >
                            HYPER FIRE
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* High-Fidelity Decrypted Video Expansion Panel */}
                  {extractedInfo && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="cyber-panel rounded-3xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500/[0.02] to-transparent rounded-full filter blur-3xl pointer-events-none" />
                      
                      <button 
                        onClick={() => setExtractedInfo(null)}
                        className="absolute top-4 right-4 bg-gray-950/60 hover:bg-gray-900 text-gray-400 hover:text-white p-1.5 rounded-xl border border-gray-900 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Video Thumbnail Bypass referrers wrapper */}
                      <div className="w-full md:w-1/3 flex flex-col gap-3 flex-shrink-0">
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-gray-900 relative group">
                          {extractedInfo.thumbnail ? (
                            <img
                              src={extractedInfo.thumbnail}
                              referrerPolicy="no-referrer"
                              alt={extractedInfo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700 bg-gray-950">
                              <Video className="w-12 h-12" />
                            </div>
                          )}
                          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/20 tracking-wider">
                            {extractedInfo.duration ? `${Math.floor(extractedInfo.duration / 60)}:${String(extractedInfo.duration % 60).padStart(2, "0")}` : "00:00"}
                          </div>
                        </div>
                        <div className="bg-[#05060b] border border-gray-900 px-3 py-2.5 rounded-xl text-[10px] font-mono flex justify-between">
                          <span className="text-gray-500 uppercase tracking-widest font-bold">Uploader:</span>
                          <span className="text-emerald-400 font-bold">{extractedInfo.uploader}</span>
                        </div>
                      </div>

                      {/* Quality & Streams payload picker list */}
                      <div className="flex-1 flex flex-col gap-4 justify-between">
                        <div>
                          <h4 className="text-white font-bold leading-snug font-sans tracking-wide text-base">{extractedInfo.title}</h4>
                          <p className="text-[10px] text-gray-500 mt-2 max-h-16 overflow-y-auto font-mono leading-relaxed pr-1">
                            {extractedInfo.description || "No metadata description retrieved for this stream."}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-500">Pick Stream Map Package:</label>
                          <div className="relative">
                            <select
                              value={selectedFormat}
                              onChange={(e) => setSelectedFormat(e.target.value)}
                              className="w-full bg-[#05060b] border border-gray-900 rounded-xl px-3 py-3 text-[11px] focus:outline-none focus:border-emerald-500/50 text-emerald-400 font-mono tracking-wide"
                            >
                              {extractedInfo.formats && extractedInfo.formats.length > 0 ? (
                                extractedInfo.formats.map((f, idx) => (
                                  <option key={idx} value={f.formatId}>
                                    {f.resolution} ({f.ext.toUpperCase()}) - {f.filesize ? `${(f.filesize / (1024 * 1024)).toFixed(1)} MB` : "Stream Stream"} {f.note ? `[${f.note}]` : ""}
                                  </option>
                                ))
                              ) : (
                                <option value="best">Default Best Stream Quality</option>
                              )}
                            </select>
                          </div>
                        </div>

                        {/* Stream Execution Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => {
                              setDownloadMode("video");
                              handleStartDownload();
                            }}
                            disabled={isPolling}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
                          >
                            <Video className="w-4 h-4" />
                            <span>DOWNLOAD STREAM</span>
                          </button>
                          <button
                            onClick={() => {
                              setDownloadMode("audio");
                              handleStartDownload();
                            }}
                            disabled={isPolling}
                            className="bg-[#0d0e18] border border-gray-900 hover:border-emerald-500/30 text-emerald-400 font-bold text-xs px-5 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Music className="w-4 h-4" />
                            <span>EXTRACT MP3</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Active Download pipeline progress indicators */}
                  {activeTask && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="cyber-panel cyber-panel-green rounded-3xl p-6 border-l-4 border-l-emerald-500 relative overflow-hidden"
                    >
                      {/* Interactive scanning grid pulse bar */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500/20 overflow-hidden">
                        <div className="h-full w-24 bg-emerald-400 animate-[pulse_1.5s_infinite] rounded-full" />
                      </div>

                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative flex items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                          </div>
                          <div>
                            <h4 className="text-white text-xs font-bold font-mono tracking-widest uppercase">DAEMON STREAM STATUS: {activeTask.status}</h4>
                            <p className="text-[10px] text-gray-400 truncate max-w-sm sm:max-w-md font-mono mt-1 font-semibold">{activeTask.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-400 font-mono font-bold text-sm">{activeTask.progress.toFixed(1)}%</span>
                        </div>
                      </div>

                      {/* Custom styled double progress bar */}
                      <div className="w-full bg-gray-950 h-3 rounded-full overflow-hidden border border-gray-900 p-[2px]">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${activeTask.progress}%` }}
                        />
                      </div>

                      {/* Telemetry data panels */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-mono text-gray-500 mt-4 border-t border-gray-900/60 pt-3">
                        <div>
                          <span className="block uppercase text-[8px] text-gray-600 font-bold tracking-widest mb-1">SPEED TELEMETRY</span>
                          <span className="text-emerald-400 font-bold text-xs">{activeTask.speed}</span>
                        </div>
                        <div>
                          <span className="block uppercase text-[8px] text-gray-600 font-bold tracking-widest mb-1">REMAINING TIME</span>
                          <span className="text-emerald-400 font-bold text-xs">{activeTask.eta}</span>
                        </div>
                        <div>
                          <span className="block uppercase text-[8px] text-gray-600 font-bold tracking-widest mb-1">PIPELINE CORE</span>
                          <span className="text-emerald-400 font-bold text-xs">THREAD #A1</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === "network" && (
                <motion.div
                  key="networkTab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  {/* Glassmorphic Subtabs Selector */}
                  <div className="flex gap-2 bg-[#05060b]/60 p-1.5 rounded-2xl border border-gray-900/60">
                    <button
                      onClick={() => setNetworkSubTab("ip")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold font-mono tracking-widest uppercase transition-all cursor-pointer ${
                        networkSubTab === "ip"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>GeoIP Locator</span>
                    </button>
                    <button
                      onClick={() => setNetworkSubTab("phone")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold font-mono tracking-widest uppercase transition-all cursor-pointer ${
                        networkSubTab === "phone"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Phone Parser</span>
                    </button>
                    <button
                      onClick={() => setNetworkSubTab("dns")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold font-mono tracking-widest uppercase transition-all cursor-pointer ${
                        networkSubTab === "dns"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <Server className="w-3.5 h-3.5" />
                      <span>DNS Resolver</span>
                    </button>
                  </div>

                  {/* GeoIP mapping tools */}
                  {networkSubTab === "ip" && (
                    <div className="cyber-panel cyber-panel-cyan rounded-3xl p-6 flex flex-col gap-5">
                      <div>
                        <h3 className="text-white font-semibold flex items-center gap-2 text-sm uppercase">
                          <Globe className="w-4 h-4 text-cyan-400" />
                          GeoIP Telemetry Mapper
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-mono leading-relaxed">
                          Enter target IPv4 addresses to retrieve approximate country coordinates, timezone maps, and internet service providers.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={ipInput}
                          onChange={(e) => setIpInput(e.target.value)}
                          placeholder="ENTER HOST IP ADDRESS (e.g. 1.1.1.1)..."
                          className="flex-1 bg-[#05060b] border border-gray-900 rounded-2xl px-4 py-4 text-xs focus:outline-none focus:border-cyan-500/50 text-cyan-300 font-mono tracking-wider"
                        />
                        <button
                          onClick={handleIpLookup}
                          disabled={isIpLoading}
                          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-900 text-white font-bold font-sans text-xs px-6 py-4 sm:py-0 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
                        >
                          {isIpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          <span>LOCATE</span>
                        </button>
                      </div>

                      {/* Dynamic interactive vector world map display inside IP Lookup results */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                        <div className="md:col-span-5 bg-[#05060b] border border-gray-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.02] rounded-full filter blur-xl pointer-events-none" />
                          
                          {ipResult ? (
                            <div className="flex flex-col gap-3 font-mono text-[11px] leading-relaxed relative z-10">
                              <div className="border-b border-gray-900 pb-2 flex justify-between">
                                <span className="text-gray-500 uppercase tracking-wider font-bold">Trace Target:</span>
                                <span className="text-cyan-400 font-bold">{ipResult.ip}</span>
                              </div>

                              {ipResult.error ? (
                                <div className="text-rose-400 font-semibold py-4 text-center flex flex-col items-center gap-2">
                                  <ShieldAlert className="w-6 h-6 text-rose-500" />
                                  <span>{ipResult.error}</span>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2.5">
                                  <div className="flex justify-between gap-2">
                                    <span className="text-gray-500">Region/State:</span>
                                    <span className="text-white font-bold text-right">{ipResult.region || "N/A"}</span>
                                  </div>
                                  <div className="flex justify-between gap-2">
                                    <span className="text-gray-500">City Locality:</span>
                                    <span className="text-white font-bold text-right">{ipResult.city || "N/A"}</span>
                                  </div>
                                  <div className="flex justify-between gap-2">
                                    <span className="text-gray-500">Country Code:</span>
                                    <span className="text-cyan-400 font-bold text-right">{ipResult.country_name} ({ipResult.country_code})</span>
                                  </div>
                                  <div className="flex justify-between gap-2">
                                    <span className="text-gray-500">ISP ASN Name:</span>
                                    <span className="text-white font-bold truncate max-w-[120px] text-right" title={ipResult.org}>{ipResult.org || "N/A"}</span>
                                  </div>
                                  <div className="flex justify-between gap-2 border-t border-gray-900/60 pt-2 text-[10px]">
                                    <span className="text-amber-500 font-bold flex items-center gap-1">
                                      <AlertTriangle className="w-3.5 h-3.5" />
                                      Approximate Geo mapping
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-600 font-mono">
                              <Compass className="w-8 h-8 text-gray-700 animate-spin mb-2" />
                              <span className="text-[10px]">No active trace payload loaded. Enter IP.</span>
                            </div>
                          )}
                        </div>

                        {/* Interactive simple Vector layout mapping representing geocoordinates */}
                        <div className="md:col-span-7 bg-[#05060b] border border-gray-900 rounded-2xl p-4 min-h-[160px] flex flex-col items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
                            backgroundImage: "radial-gradient(circle, #06b6d4 1.5px, transparent 1.5px)",
                            backgroundSize: "16px 16px"
                          }} />

                          {ipResult && !ipResult.error ? (
                            <div className="w-full h-full flex flex-col justify-between relative z-10">
                              <div className="flex items-center gap-2 border-b border-gray-900 pb-2">
                                <MapPin className="w-4 h-4 text-cyan-400 animate-bounce" />
                                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Coordinates mapping lock</span>
                              </div>
                              <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
                                <div className="absolute w-12 h-12 bg-cyan-500/10 rounded-full border border-cyan-500/30 animate-ping pointer-events-none" />
                                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/80 flex items-center justify-center font-mono font-bold text-cyan-400 text-[10px]">
                                  LOC
                                </div>
                                <span className="text-[9px] text-cyan-400 font-mono font-bold tracking-widest uppercase mt-3">
                                  LAT: {ipResult.latitude || "Approx"} / LON: {ipResult.longitude || "Approx"}
                                </span>
                              </div>
                              <div className="text-[8px] text-gray-600 font-mono text-center">
                                Telemetry accuracy mapped via global lookup directory tables.
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center text-gray-700 font-mono p-6">
                              <MapPin className="w-8 h-8 text-gray-800 mb-2" />
                              <span className="text-[10px]">Location maps offline. Locate IP address.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Telephony validation layout panel */}
                  {networkSubTab === "phone" && (
                    <div className="cyber-panel cyber-panel-cyan rounded-3xl p-6 flex flex-col gap-5">
                      <div>
                        <h3 className="text-white font-semibold flex items-center gap-2 text-sm uppercase">
                          <Phone className="w-4 h-4 text-cyan-400" />
                          ITU-T Telephony Analyzer
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-mono leading-relaxed">
                          Verify and restructure phone input formats against international E.164 recommendations. Retrieve carriers and validated countries.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <select
                          value={phoneRegion}
                          onChange={(e) => setPhoneRegion(e.target.value)}
                          className="bg-[#05060b] border border-gray-900 rounded-2xl px-3 py-4 text-xs font-mono font-bold text-cyan-300 focus:outline-none sm:w-[130px]"
                        >
                          <option value="ID">ID INDONESIA (+62)</option>
                          <option value="US">US UNITED STATES (+1)</option>
                          <option value="GB">GB UNITED KINGDOM (+44)</option>
                          <option value="SG">SG SINGAPORE (+65)</option>
                          <option value="MY">MY MALAYSIA (+60)</option>
                          <option value="AU">AU AUSTRALIA (+61)</option>
                        </select>
                        <input
                          type="text"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="ENTER PHONE STREAM PAYLOAD (e.g. 0812345678)..."
                          className="flex-1 bg-[#05060b] border border-gray-900 rounded-2xl px-4 py-4 text-xs focus:outline-none focus:border-cyan-500/50 text-cyan-300 font-mono tracking-wider"
                        />
                        <button
                          onClick={handlePhoneLookup}
                          disabled={isPhoneLoading}
                          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-900 text-white font-bold font-sans text-xs px-6 py-4 sm:py-0 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
                        >
                          {isPhoneLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          <span>ANALYZE</span>
                        </button>
                      </div>

                      {/* Display telephony analysis cards */}
                      {phoneResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 md:grid-cols-12 gap-5"
                        >
                          <div className="md:col-span-4 bg-[#05060b] border border-gray-900 rounded-2xl p-4 flex flex-col justify-between items-center relative min-h-[160px]">
                            <div className="absolute top-2 left-2 text-[8px] text-gray-600 font-mono uppercase tracking-wider">Device Mock classification</div>
                            <Smartphone className={`w-12 h-12 mt-6 ${phoneResult.isValid ? "text-cyan-400" : "text-gray-700"}`} />
                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider font-bold mt-2">
                              {phoneResult.type || "UNKNOWN LINE"}
                            </span>
                          </div>

                          <div className="md:col-span-8 bg-[#05060b] border border-gray-900 rounded-2xl p-4 flex flex-col gap-3 font-mono text-[11px] leading-relaxed">
                            <div className="border-b border-gray-900 pb-2 flex justify-between">
                              <span className="text-gray-500 uppercase font-bold">Input Payload String:</span>
                              <span className="text-cyan-400 font-bold">{phoneResult.input}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between gap-2">
                                  <span className="text-gray-500">Structure Valid:</span>
                                  <span className={`font-bold uppercase ${phoneResult.isValid ? "text-emerald-400" : "text-rose-500"}`}>
                                    {phoneResult.isValid ? "TRUE" : "FALSE"}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <span className="text-gray-500">E.164 Format:</span>
                                  <span className="text-white font-bold">{phoneResult.number || "N/A"}</span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between gap-2">
                                  <span className="text-gray-500">ITU ISO country:</span>
                                  <span className="text-white font-bold uppercase">{phoneResult.country || "N/A"}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <span className="text-gray-500">Calling Prefix:</span>
                                  <span className="text-white font-bold">+{phoneResult.countryCallingCode || "N/A"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* DNS authoritative query resolver layout */}
                  {networkSubTab === "dns" && (
                    <div className="cyber-panel cyber-panel-cyan rounded-3xl p-6 flex flex-col gap-5">
                      <div>
                        <h3 className="text-white font-semibold flex items-center gap-2 text-sm uppercase">
                          <Server className="w-4 h-4 text-cyan-400" />
                          DNS Authority Resolver
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-mono leading-relaxed">
                          Resolve domains into active registered IPv4 A-records to identify server setups.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={dnsInput}
                          onChange={(e) => setDnsInput(e.target.value)}
                          placeholder="ENTER TARGET HOSTNAME DOMAIN (e.g. google.com)..."
                          className="flex-1 bg-[#05060b] border border-gray-900 rounded-2xl px-4 py-4 text-xs focus:outline-none focus:border-cyan-500/50 text-cyan-300 font-mono tracking-wider"
                        />
                        <button
                          onClick={handleDnsLookup}
                          disabled={isDnsLoading}
                          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-900 text-white font-bold font-sans text-xs px-6 py-4 sm:py-0 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
                        >
                          {isDnsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          <span>RESOLVE</span>
                        </button>
                      </div>

                      {/* Display DNS records */}
                      {dnsResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-[#05060b] border border-gray-900 rounded-2xl p-4 flex flex-col gap-3 font-mono text-[11px] leading-relaxed"
                        >
                          <div className="border-b border-gray-900 pb-2 flex justify-between">
                            <span className="text-gray-500 uppercase font-bold">Domain Source Name:</span>
                            <span className="text-cyan-400 font-bold">{dnsResult.hostname}</span>
                          </div>

                          <div className="flex flex-col gap-2 mt-1">
                            <span className="text-gray-500 uppercase tracking-widest font-bold text-[9px]">Resolved Server Host Addresses:</span>
                            {dnsResult.addresses && dnsResult.addresses.length > 0 ? (
                              <div className="flex flex-col gap-2">
                                {dnsResult.addresses.map((addr, idx) => (
                                  <div key={idx} className="flex items-center justify-between bg-[#07080f] border border-gray-900 p-3 rounded-xl">
                                    <div className="flex items-center gap-2">
                                      <CornerDownRight className="w-3.5 h-3.5 text-cyan-500" />
                                      <span className="text-cyan-300 font-bold font-mono text-xs">{addr}</span>
                                    </div>
                                    <button
                                      onClick={() => handleDnsIpLookup(addr)}
                                      className="text-[9px] bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all uppercase tracking-wider"
                                    >
                                      Trace IP Loc
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-600 text-[10px]">No active nameserver IP mapping returned.</span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "library" && (
                <motion.div
                  key="libraryTab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  {/* Secure Storage Vault cache maps */}
                  <div className="cyber-panel cyber-panel-purple rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.02] rounded-full filter blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between border-b border-gray-900/60 pb-3">
                      <div>
                        <h3 className="text-white font-semibold flex items-center gap-2 text-sm uppercase">
                          <Layers className="w-4 h-4 text-purple-400" />
                          Standalone Asset Vault
                        </h3>
                        <p className="text-xs text-gray-500 font-mono mt-1 leading-relaxed">
                          Manage extracted direct stream objects. Saved locally with standard content headers.
                        </p>
                      </div>
                      <button 
                        onClick={loadHistory}
                        disabled={isLoadingHistory}
                        className="bg-[#05060b] border border-gray-900 hover:border-purple-500/20 text-purple-400 p-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? "animate-spin" : ""}`} />
                      </button>
                    </div>

                    {isLoadingHistory ? (
                      <div className="h-44 flex items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
                      </div>
                    ) : history.length === 0 ? (
                      <div className="h-44 flex flex-col items-center justify-center text-center gap-2 bg-[#05060b]/30 rounded-2xl border border-dashed border-gray-900 p-6">
                        <AlertTriangle className="w-8 h-8 text-gray-700 mb-1" />
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">No local media metadata located on disk.</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[440px] overflow-y-auto pr-1">
                        {history.map((record, idx) => (
                          <div 
                            key={idx} 
                            className="bg-[#05060b]/70 border border-gray-900 hover:border-purple-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="bg-purple-950/10 border border-purple-500/20 p-2.5 rounded-xl text-purple-400 flex items-center justify-center mt-1">
                                {record.mode === "audio" ? <Music className="w-4 h-4 animate-pulse" /> : <Video className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-white text-xs font-bold leading-tight truncate max-w-sm" title={record.title}>{record.title}</h4>
                                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9px] font-mono text-gray-500 mt-2">
                                  <span className="bg-[#0d0e18] px-1.5 py-0.5 rounded text-purple-400 uppercase font-bold tracking-widest">{record.ext}</span>
                                  <span>|</span>
                                  <span>PRESET: {record.quality.toUpperCase()}</span>
                                  <span>|</span>
                                  <span>SIZE: {(record.size / (1024 * 1024)).toFixed(1)} MB</span>
                                  <span>|</span>
                                  <span>SYNCED: {new Date(record.addedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 justify-end">
                              <a
                                href={`/api/download/file/${record.id}`}
                                download
                                className="bg-purple-600/10 hover:bg-purple-600 border border-purple-500/30 text-purple-400 hover:text-white px-3.5 py-2 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>GET PAYLOAD</span>
                              </a>
                              <button
                                onClick={() => handleDeleteFile(record.id, record.title)}
                                className="bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white p-2.5 rounded-xl transition-all cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "cookies" && (
                <motion.div
                  key="cookiesTab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  <div className="cyber-panel cyber-panel-amber rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full filter blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between border-b border-gray-900/60 pb-3">
                      <div>
                        <h3 className="text-white font-semibold flex items-center gap-2 text-sm uppercase">
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          Bypass Credentials & Cookies
                        </h3>
                        <p className="text-xs text-gray-500 font-mono mt-1 leading-relaxed">
                          Provide session cookies to authenticate standalone daemons for age-restricted or private videos.
                        </p>
                      </div>
                      <button 
                        onClick={checkCookiesStatus}
                        disabled={isCheckingCookies}
                        className="bg-[#05060b] border border-gray-900 hover:border-amber-500/20 text-amber-400 p-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        <RefreshCw className={`w-4 h-4 ${isCheckingCookies ? "animate-spin" : ""}`} />
                      </button>
                    </div>

                    {/* Status indicator widget */}
                    <div className="bg-[#05060b]/60 border border-gray-900 rounded-2xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl flex items-center justify-center ${cookiesConfigured ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`}>
                          <Server className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block">Daemon Status</span>
                          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${cookiesConfigured ? "text-emerald-400" : "text-amber-500"}`}>
                            {cookiesConfigured ? "ACTIVE CREDENTIALS INJECTED" : "STANDARD DAEMON RESTRICTIONS (ANONYMOUS)"}
                          </span>
                        </div>
                      </div>

                      {cookiesConfigured && cookiesInfo && (
                        <div className="flex flex-col sm:items-end font-mono text-[10px]">
                          <span className="text-gray-500">PAYLOAD SIZE: <strong className="text-white">{(cookiesInfo.size / 1024).toFixed(2)} KB</strong></span>
                          <span className="text-gray-500 mt-0.5">UPDATED AT: <strong className="text-white">{new Date(cookiesInfo.updatedAt).toLocaleTimeString()}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* File Upload drag-and-drop or text area input */}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-bold">Injected Cookie Text Content (Netscape cookies.txt Format)</label>
                        <textarea
                          rows={6}
                          value={cookiesContent}
                          onChange={(e) => setCookiesContent(e.target.value)}
                          placeholder={`# Netscape HTTP Cookie File
# http://curl.haxx.se/rfc/cookie_spec.html
# This is a generated file! Do not edit.

.tiktok.com	TRUE	/	FALSE	1774351631	sessionid	abcd1234efgh...`}
                          className="w-full bg-[#05060b] border border-gray-900 rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:border-amber-500/50 text-amber-400 font-mono tracking-wider placeholder:text-gray-700 resize-none leading-relaxed"
                        />
                      </div>

                      {/* File Upload Drag-and-Drop Dropzone support */}
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result && typeof event.target.result === "string") {
                                setCookiesContent(event.target.result);
                                showToast("info", "Cookies File Parsed", `Loaded cookies text payload from: ${file.name}`);
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = ".txt";
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result && typeof event.target.result === "string") {
                                  setCookiesContent(event.target.result);
                                  showToast("info", "Cookies File Loaded", `Loaded cookies text payload from: ${file.name}`);
                                }
                              };
                              reader.readAsText(file);
                            }
                          };
                          input.click();
                        }}
                        className="cursor-pointer border border-dashed border-gray-800 hover:border-amber-500/30 bg-[#05060b]/40 rounded-2xl py-6 px-4 text-center transition-all flex flex-col items-center justify-center gap-2 group"
                      >
                        <Download className="w-6 h-6 text-gray-600 group-hover:text-amber-400 transition-colors animate-bounce" />
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-bold group-hover:text-gray-400 transition-colors">DRAG & DROP COOKIES.TXT FILE HERE, OR CLICK TO BROWSE</span>
                        <span className="text-[9px] text-gray-600 font-mono">Accepts standard .txt export format cookies files.</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-1">
                        <button
                          onClick={handleSaveCookies}
                          disabled={isSavingCookies || !cookiesContent.trim()}
                          className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-xs py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 active:scale-95"
                        >
                          {isSavingCookies ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                          <span>MAP & SAVE SESSION CREDENTIALS</span>
                        </button>
                        
                        {cookiesConfigured && (
                          <button
                            onClick={handleDeleteCookies}
                            className="bg-[#05060b] border border-rose-950 hover:border-rose-700 text-rose-500 hover:bg-rose-950/20 font-bold text-xs px-5 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>WIPE DAEMON CREDENTIALS</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#0d0e18]/40 border border-gray-900/60 rounded-2xl p-4 flex gap-3 mt-1.5 items-start">
                      <HelpCircle className="w-5 h-5 text-amber-500/60 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 text-[10px] font-mono text-gray-500 leading-relaxed">
                        <strong className="text-gray-400 block mb-1">HOW TO EXPORT COOKIES:</strong>
                        1. Install a browser extension like <span className="text-amber-500">Get cookies.txt LOCALLY</span> (Chrome/Edge) or export tools.<br/>
                        2. Navigate to TikTok / YouTube, log into your active account.<br/>
                        3. Open the extension, click <span className="text-amber-500">Export as cookies.txt</span> (select Netscape format).<br/>
                        4. Upload or drag-and-drop the exported file here to authenticate your download requests.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* RIGHT COLUMN PANEL: SYSTEM CONSOLE MODULE & CONTROLS (4 COLS) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Hacker Terminal system Console Feed widget */}
          <div className="cyber-panel rounded-3xl p-4 flex flex-col min-h-[360px] bg-[#05060b]/95 border-l-2 border-l-emerald-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.01] rounded-full filter blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-3 relative z-10">
              <span className="text-[10px] text-emerald-400 font-bold font-mono flex items-center gap-1.5 tracking-widest uppercase">
                <Terminal className="w-4 h-4 animate-pulse" />
                SYSTEM LIVE DAEMON
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Simulated interactive Hacker terminal terminal */}
            <div className="flex-1 bg-black/80 p-3.5 rounded-2xl border border-gray-950 font-mono text-[10px] leading-relaxed overflow-y-auto h-[230px] scrollbar-thin relative z-10">
              <div className="flex flex-col gap-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-1.5 break-all">
                    <span className="text-gray-700 text-[9px] select-none">[{log.timestamp}]</span>
                    {log.type === "success" && <span className="text-emerald-500 select-none">&gt;&gt;</span>}
                    {log.type === "warning" && <span className="text-amber-500 select-none">WARN:</span>}
                    {log.type === "error" && <span className="text-rose-500 select-none">ERR:</span>}
                    {log.type === "command" && <span className="text-cyan-400 select-none">RUN:</span>}
                    <span className={
                      log.type === "success" ? "text-emerald-400 font-medium" :
                      log.type === "warning" ? "text-amber-400" :
                      log.type === "error" ? "text-rose-400" :
                      log.type === "command" ? "text-cyan-400" : "text-gray-500"
                    }>
                      {log.text}
                    </span>
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>
            </div>

            {/* Quick Hacker actions / shortcuts */}
            <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-gray-900/60 relative z-10">
              <button 
                onClick={() => handleConsoleShortcut("reboot")}
                className="text-[8px] font-mono font-bold tracking-wider bg-gray-950 hover:bg-emerald-500/10 text-emerald-400 border border-gray-900 hover:border-emerald-500/20 py-1.5 rounded-lg transition-all cursor-pointer uppercase"
              >
                RE-BOOT CORE
              </button>
              <button 
                onClick={() => handleConsoleShortcut("clearcache")}
                className="text-[8px] font-mono font-bold tracking-wider bg-gray-950 hover:bg-amber-500/10 text-amber-400 border border-gray-900 hover:border-amber-500/20 py-1.5 rounded-lg transition-all cursor-pointer uppercase"
              >
                Flush Logs
              </button>
              <button 
                onClick={() => handleConsoleShortcut("dbstatus")}
                className="text-[8px] font-mono font-bold tracking-wider bg-gray-950 hover:bg-cyan-500/10 text-cyan-400 border border-gray-900 hover:border-cyan-500/20 py-1.5 rounded-lg transition-all cursor-pointer uppercase"
              >
                Sync Vault
              </button>
            </div>
          </div>

          {/* Core Support Platform indicators */}
          <div className="bg-[#05060b]/60 border border-gray-900 rounded-3xl p-4 flex flex-col gap-2 font-mono">
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Active Daemon Adapters</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {["YOUTUBE", "TIKTOK", "INSTAGRAM", "TWITTER/X", "CAPCUT", "REDDIT", "PINTEREST"].map((plat, idx) => (
                <span key={idx} className="text-[9px] bg-gray-950/80 border border-gray-900/80 text-gray-400 px-2 py-0.5 rounded-lg font-bold font-mono">
                  {plat}
                </span>
              ))}
            </div>
          </div>
        </aside>

      </main>

      {/* Futuristic status copyright footer */}
      <footer className="border-t border-gray-900/60 bg-[#04050a]/60 backdrop-blur-md py-4 px-6 text-center text-[10px] font-mono text-gray-500 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="tracking-wide uppercase">ULTRAPROMAX HYPER DASHBOARD © 2026</span>
          <span className="text-gray-600">IP lookup maps traced approximately via ipapi.co structures. ITU formatting via libphonenumber layers.</span>
        </div>
      </footer>
    </div>
  );
}
