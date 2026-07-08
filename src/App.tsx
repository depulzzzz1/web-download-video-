import { useState, useEffect, useRef } from "react";
import { 
  Terminal, Cpu, Layers, Wifi, Video, Music, Server, Activity, 
  RefreshCw, Clock, Sparkles, Network, X, Check, ShieldAlert, 
  Sparkle, HardDrive, Search, Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import ParticleBackground from "./components/ParticleBackground";
import MatrixRain from "./components/MatrixRain";
import CommandPalette from "./components/CommandPalette";
import DashboardView from "./components/DashboardView";
import DecryptionGateway from "./components/DecryptionGateway";
import DiagnosticsPanel from "./components/DiagnosticsPanel";
import AssetVault from "./components/AssetVault";
import SessionCredentials from "./components/SessionCredentials";

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
  // Loading & boot sequence states
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStepText, setBootStepText] = useState("INITIALIZING SECURE SYSTEM SHELL...");

  // Layout states
  const [activeTab, setActiveTab] = useState<"dashboard" | "downloader" | "network" | "library" | "cookies">("dashboard");
  const [networkSubTab, setNetworkSubTab] = useState<"ip" | "phone" | "dns">("ip");
  const [showMatrix, setShowMatrix] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Notifications / toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // System console logs
  const [logs, setLogs] = useState<LogMessage[]>([
    { id: "1", timestamp: "10:17:00", type: "info", text: "Initializing UltraProMax v7.1 HYPER CORE..." },
    { id: "2", timestamp: "10:17:01", type: "info", text: "Verifying python-based standalone yt-dlp layer..." },
    { id: "3", timestamp: "10:17:02", type: "success", text: "yt-dlp compiled successfully (v2026.07.04)." },
    { id: "4", timestamp: "10:17:03", type: "success", text: "Network diagnostics telemetry: ONLINE." },
  ]);
  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  // Downloader inputs
  const [url, setUrl] = useState("");
  const [detectedPlatform, setDetectedPlatform] = useState("Unknown/yt-dlp");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [downloadMode, setDownloadMode] = useState<"video" | "audio">("video");
  const [videoQuality, setVideoQuality] = useState<string>("best");
  
  // Download task polling
  const [activeTask, setActiveTask] = useState<TaskStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Cloud library history
  const [history, setHistory] = useState<DownloadRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Network diagnostics inputs
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

  // Cookies authentication
  const [cookiesConfigured, setCookiesConfigured] = useState(false);
  const [cookiesInfo, setCookiesInfo] = useState<{ size: number; updatedAt: string } | null>(null);
  const [cookiesContent, setCookiesContent] = useState("");
  const [isSavingCookies, setIsSavingCookies] = useState(false);
  const [isCheckingCookies, setIsCheckingCookies] = useState(false);

  // Telemetry stats
  const [stats, setStats] = useState({
    uptime: "2h 45m",
    totalSize: "0 B",
    downloadCount: 0,
    pingTime: 21,
  });

  // Multi-stage boot sequence helper
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

  // Logger helper
  const addLog = (text: string, type: LogMessage["type"] = "info") => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setLogs((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), timestamp: timeStr, type, text }
    ]);
  };

  // Toast notifier
  const showToast = (type: ToastMessage["type"], title: string, message: string) => {
    const id = String(Date.now());
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Auto-scroll logs terminal
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Ping simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        pingTime: Math.floor(Math.random() * 8) + 18,
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Platform auto detection URL parser
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

  // Load local files history
  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/download/list");
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
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

  // Cookies validation
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

  const handleSaveCookiesDirectly = async (content: string) => {
    setIsSavingCookies(true);
    addLog("Saving uploaded credentials/cookies configuration on disk...", "command");
    try {
      const res = await fetch("/api/download/cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
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

  const handleDeleteCookiesDirectly = async () => {
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

  // Stream Extractor
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
        showToast("success", "Stream Extracted", `Successfully loaded format maps.`);
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

  // Download Task Dispatcher
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

  // Poll Task Status Daemon
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
            showToast("success", "Download Complete", `File saved successfully.`);
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

  // Local storage Purger
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

  // GeoIP lookup
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
          showToast("success", "IP Geolocation Resolved", `Location: ${data.city || "N/A"}`);
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

  // Phone validator
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

  // DNS Resolver
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

  const handleDnsIpLookup = (ip: string) => {
    setIpInput(ip);
    setNetworkSubTab("ip");
    addLog(`Piping Domain address record [${ip}] back to Geolocation tracer...`, "info");
    setTimeout(() => {
      handleIpLookup();
    }, 100);
  };

  // Quick Action Shortcuts inside hacker console
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
    <div className="min-h-screen bg-[#030408] text-gray-200 font-sans flex flex-col relative overflow-hidden select-none">
      
      {/* Background visual layers */}
      <ParticleBackground />
      {showMatrix && <MatrixRain />}

      {/* Cmd+K Command palette */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsCommandPaletteOpen(false);
        }}
        onShortcut={handleConsoleShortcut}
      />

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100] max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className="bg-[#0a0c15]/95 backdrop-blur-xl border border-white/[0.04] rounded-xl p-4 shadow-2xl flex gap-3 relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                t.type === "success" ? "bg-emerald-500" :
                t.type === "error" ? "bg-rose-500" :
                t.type === "warning" ? "bg-amber-500" : "bg-cyan-500"
              }`} />
              <div className="flex-shrink-0 mt-0.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </div>
              <div className="flex-1">
                <h5 className="text-white text-xs font-bold font-sans uppercase tracking-wider">{t.title}</h5>
                <p className="text-gray-400 text-[11px] mt-1 font-mono leading-relaxed">{t.message}</p>
              </div>
              <div className="absolute bottom-0 left-1 right-0 h-[2px] bg-gray-950 overflow-hidden">
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

      {/* Boot sequences screen */}
      <AnimatePresence>
        {booting && (
          <motion.div 
            className="fixed inset-0 bg-[#020306] z-[1000] flex flex-col items-center justify-center p-6"
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
              <div className="w-full mt-8 bg-black border border-white/[0.04] rounded-full h-2 overflow-hidden p-[2px]">
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

      {/* Task Completion Celebration */}
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
              className="bg-[#0a0c14]/95 border border-emerald-500/40 p-8 rounded-3xl text-center shadow-3xl max-w-sm flex flex-col items-center gap-4"
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

      {/* Top Header Panel */}
      <header className="border-b border-white/[0.04] bg-[#030408]/85 backdrop-blur-2xl sticky top-0 z-40 px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
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

        {/* Smart search / command bar trigger */}
        <div className="hidden md:flex items-center gap-2.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-white/10 px-4 py-2.5 rounded-xl cursor-pointer w-[280px] transition-all" onClick={() => setIsCommandPaletteOpen(true)}>
          <Search className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Type <kbd className="bg-white/10 px-1 rounded">⌘K</kbd> to search</span>
        </div>

        {/* Telemetry quick values */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.01] border border-white/[0.04]">
            <Wifi className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-gray-500">PING: <strong className="text-cyan-400 font-bold">{stats.pingTime}ms</strong></span>
          </div>
          <button 
            onClick={() => {
              setShowMatrix(!showMatrix);
              addLog(`Matrix backdrop changed: ${!showMatrix ? "ON" : "OFF"}`, "info");
            }}
            className="cursor-pointer px-3 py-1.5 rounded-xl border border-white/[0.04] text-[9px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/15 transition-all"
          >
            Matrix: {showMatrix ? "ON" : "OFF"}
          </button>
        </div>
      </header>

      {/* Cyber Hero typography banner */}
      <section className="text-center py-10 px-4 max-w-4xl mx-auto relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-emerald-500/[0.02] filter blur-[100px] rounded-full pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] text-emerald-400 font-mono uppercase tracking-widest">
            <Sparkle className="w-3 h-3 animate-spin" />
            <span>Standalone Web Platform Calibrated</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white mt-3 leading-none">
            Next-Gen Cyber <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">Engine Matrix</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl font-mono mt-4 leading-relaxed">
            Unleash hyper-optimized media stream downloads and interactive network intelligence parsing. Hand-crafted, seamless, and completely secure.
          </p>
        </motion.div>
      </section>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-start">
        
        {/* LEFT COLUMN PANEL: TAB CONTROLLER & ACTIVE SCREEN VIEWS (8 COLS) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Glassmorphic Nav Tab controller bar */}
          <div className="flex flex-wrap gap-1 bg-[#05060b]/60 border border-white/[0.04] p-1.5 rounded-2xl backdrop-blur-xl relative">
            {[
              { id: "dashboard", label: "Dashboard", color: "text-emerald-400", activeBg: "bg-emerald-500/10 border-emerald-500/20" },
              { id: "downloader", label: "Downloader", color: "text-emerald-400", activeBg: "bg-emerald-500/10 border-emerald-500/20" },
              { id: "network", label: "Diagnostics", color: "text-cyan-400", activeBg: "bg-cyan-500/10 border-cyan-500/20" },
              { id: "library", label: "Vault", color: "text-purple-400", activeBg: "bg-purple-500/10 border-purple-500/20" },
              { id: "cookies", label: "Cookies", color: "text-amber-400", activeBg: "bg-amber-500/10 border-amber-500/20" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "library" || tab.id === "network" || tab.id === "dashboard") {
                    loadHistory();
                  }
                  if (tab.id === "cookies") {
                    checkCookiesStatus();
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-[10px] sm:text-xs font-semibold uppercase tracking-wider font-sans transition-all relative z-10 cursor-pointer ${
                  activeTab === tab.id ? tab.color : "text-gray-500 hover:text-white"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabOutline"
                    className={`absolute inset-0 border rounded-xl z-[-1] ${tab.activeBg}`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active component panels */}
          <div className="flex-1 min-h-[460px]">
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard_tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <DashboardView
                    stats={stats}
                    history={history}
                    onNavigate={(tab) => {
                      setActiveTab(tab);
                      if (tab === "library") loadHistory();
                      if (tab === "cookies") checkCookiesStatus();
                    }}
                    onShortcut={handleConsoleShortcut}
                    onExtractSampleUrl={(sampleUrl) => {
                      setUrl(sampleUrl);
                      setActiveTab("downloader");
                      // Trigger extract next tick
                      setTimeout(() => {
                        handleExtract();
                      }, 100);
                    }}
                  />
                </motion.div>
              )}

              {activeTab === "downloader" && (
                <motion.div
                  key="downloader_tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <DecryptionGateway
                    url={url}
                    setUrl={setUrl}
                    detectedPlatform={detectedPlatform}
                    isExtracting={isExtracting}
                    extractedInfo={extractedInfo}
                    setExtractedInfo={setExtractedInfo}
                    selectedFormat={selectedFormat}
                    setSelectedFormat={setSelectedFormat}
                    downloadMode={downloadMode}
                    setDownloadMode={setDownloadMode}
                    videoQuality={videoQuality}
                    setVideoQuality={setVideoQuality}
                    activeTask={activeTask}
                    isPolling={isPolling}
                    handleExtract={handleExtract}
                    handleStartDownload={handleStartDownload}
                  />
                </motion.div>
              )}

              {activeTab === "network" && (
                <motion.div
                  key="diagnostics_tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <DiagnosticsPanel
                    networkSubTab={networkSubTab}
                    setNetworkSubTab={setNetworkSubTab}
                    ipInput={ipInput}
                    setIpInput={setIpInput}
                    isIpLoading={isIpLoading}
                    ipResult={ipResult}
                    handleIpLookup={handleIpLookup}
                    phoneInput={phoneInput}
                    setPhoneInput={setPhoneInput}
                    phoneRegion={phoneRegion}
                    setPhoneRegion={setPhoneRegion}
                    isPhoneLoading={isPhoneLoading}
                    phoneResult={phoneResult}
                    handlePhoneLookup={handlePhoneLookup}
                    dnsInput={dnsInput}
                    setDnsInput={setDnsInput}
                    isDnsLoading={isDnsLoading}
                    dnsResult={dnsResult}
                    handleDnsLookup={handleDnsLookup}
                    handleDnsIpLookup={handleDnsIpLookup}
                  />
                </motion.div>
              )}

              {activeTab === "library" && (
                <motion.div
                  key="asset_vault_tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <AssetVault
                    history={history}
                    isLoadingHistory={isLoadingHistory}
                    loadHistory={loadHistory}
                    handleDeleteFile={handleDeleteFile}
                  />
                </motion.div>
              )}

              {activeTab === "cookies" && (
                <motion.div
                  key="session_credentials_tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <SessionCredentials
                    cookieStatus={{
                      exists: cookiesConfigured,
                      lineCount: cookiesInfo?.size || 0,
                      updatedAt: cookiesInfo?.updatedAt || null
                    }}
                    onSaveCookies={handleSaveCookiesDirectly}
                    onDeleteCookies={handleDeleteCookiesDirectly}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* RIGHT COLUMN PANEL: TELEMETRY console daemon (4 COLS) */}
        <aside className="lg:col-span-4 flex flex-col gap-6 w-full">
          
          {/* Real time Logs daemon console Terminal widget */}
          <div className="cyber-panel rounded-3xl p-4 flex flex-col min-h-[360px] bg-[#05060b]/95 border-l-2 border-l-emerald-500/30 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.01] rounded-full filter blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5 mb-3 relative z-10">
              <span className="text-[10px] text-emerald-400 font-bold font-mono flex items-center gap-1.5 tracking-widest uppercase">
                <Terminal className="w-4 h-4 animate-pulse" />
                SYSTEM LIVE DAEMON
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* In-view console logs */}
            <div className="flex-1 bg-black/60 p-3.5 rounded-2xl border border-white/[0.02] font-mono text-[10px] leading-relaxed overflow-y-auto h-[230px] scrollbar-thin relative z-10">
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

            {/* Terminal quick-launch triggers */}
            <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-white/[0.04] relative z-10">
              <button 
                onClick={() => handleConsoleShortcut("reboot")}
                className="text-[8px] font-mono font-bold tracking-wider bg-gray-950 hover:bg-emerald-500/10 text-emerald-400 border border-white/[0.04] hover:border-emerald-500/20 py-2 rounded-lg transition-all cursor-pointer uppercase text-center"
              >
                RE-BOOT CORE
              </button>
              <button 
                onClick={() => handleConsoleShortcut("clearcache")}
                className="text-[8px] font-mono font-bold tracking-wider bg-gray-950 hover:bg-amber-500/10 text-amber-400 border border-white/[0.04] hover:border-amber-500/20 py-2 rounded-lg transition-all cursor-pointer uppercase text-center"
              >
                Flush Logs
              </button>
              <button 
                onClick={() => handleConsoleShortcut("dbstatus")}
                className="text-[8px] font-mono font-bold tracking-wider bg-gray-950 hover:bg-cyan-500/10 text-cyan-400 border border-white/[0.04] hover:border-cyan-500/20 py-2 rounded-lg transition-all cursor-pointer uppercase text-center"
              >
                Sync Vault
              </button>
            </div>
          </div>

          {/* Active adapters status indicator block */}
          <div className="bg-[#05060b]/60 border border-white/[0.04] rounded-3xl p-4 flex flex-col gap-2 font-mono">
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Active Daemon Adapters</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {["YOUTUBE", "TIKTOK", "INSTAGRAM", "TWITTER/X", "CAPCUT", "REDDIT", "PINTEREST"].map((plat, idx) => (
                <span key={idx} className="text-[9px] bg-gray-950/80 border border-white/[0.04] text-gray-400 px-2 py-0.5 rounded-lg font-bold font-mono">
                  {plat}
                </span>
              ))}
            </div>
          </div>
        </aside>

      </main>

      {/* Futuristic status copyright footer */}
      <footer className="border-t border-white/[0.04] bg-[#020306]/60 backdrop-blur-md py-4 px-6 text-center text-[10px] font-mono text-gray-500 z-10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="tracking-wide uppercase">ULTRAPROMAX HYPER DASHBOARD © 2026</span>
          <span className="text-gray-600">IP lookup maps traced approximately via ipapi.co structures. ITU formatting via libphonenumber layers.</span>
        </div>
      </footer>
    </div>
  );
}
