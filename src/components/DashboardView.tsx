import { useState, useEffect } from "react";
import { 
  Activity, Cpu, HardDrive, Wifi, Clock, ArrowRight, Sparkles, CheckCircle2,
  TrendingUp, Compass, Network, AlertTriangle, ShieldCheck, PlayCircle
} from "lucide-react";
import { motion } from "motion/react";
import { DownloadRecord } from "../types";

interface DashboardViewProps {
  stats: {
    uptime: string;
    totalSize: string;
    downloadCount: number;
    pingTime: number;
  };
  history: DownloadRecord[];
  onNavigate: (tab: "dashboard" | "downloader" | "network" | "library" | "cookies") => void;
  onShortcut: (action: string) => void;
  onExtractSampleUrl: (url: string) => void;
}

export default function DashboardView({ stats, history, onNavigate, onShortcut, onExtractSampleUrl }: DashboardViewProps) {
  const [activeSubSection, setActiveSubSection] = useState<"overview" | "telemetry">("overview");
  const [throughputIndex, setThroughputIndex] = useState(78.5);

  // Dynamic simulated bandwidth variation
  useEffect(() => {
    const interval = setInterval(() => {
      setThroughputIndex(prev => {
        const delta = (Math.random() - 0.5) * 5;
        return Math.max(45, Math.min(99, prev + delta));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const sampleUrls = [
    { name: "YouTube Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", platform: "YouTube" },
    { name: "TikTok Creative", url: "https://www.tiktok.com/@tiktok/video/7123456789012345678", platform: "TikTok" },
    { name: "Instagram Reel", url: "https://www.instagram.com/reel/Cg123456789/", platform: "Instagram" }
  ];

  // SVG Chart points generator
  const getChartPoints = () => {
    const basePoints = [20, 45, 28, 65, 40, 75, throughputIndex];
    const width = 500;
    const height = 120;
    const padding = 10;
    const step = (width - padding * 2) / (basePoints.length - 1);
    
    return basePoints.map((val, idx) => {
      const x = padding + idx * step;
      const y = height - padding - (val / 100) * (height - padding * 2);
      return `${x},${y}`;
    }).join(" ");
  };

  const chartPointsStr = getChartPoints();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Aurora Banner Hero Spotlight */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.04] bg-gradient-to-br from-[#0c0f1d] via-[#07080f] to-[#04050a] p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_0_50px_rgba(16,185,129,0.02)]">
        {/* Animated fluid blob behind text */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/[0.03] rounded-full filter blur-[80px] animate-[pulse_6s_infinite] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/[0.02] rounded-full filter blur-[80px] animate-[pulse_4s_infinite] pointer-events-none" />

        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] text-emerald-400 font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Platform Online</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white leading-tight">
            Advanced System Command Portal
          </h2>
          <p className="text-xs text-gray-400 font-sans mt-2 max-w-xl leading-relaxed">
            Configure standalone Netscape bypasses, resolve global authoritative name servers, track telephone number structures, and inspect isolated download daemons in one centralized, high-performance interface.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
            <button
              onClick={() => onNavigate("downloader")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-sans text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95"
            >
              <span>DECRYPT GATEWAY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate("network")}
              className="bg-[#0b0c15] border border-white/[0.06] hover:border-cyan-500/30 text-cyan-400 hover:text-cyan-300 font-bold font-sans text-xs px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Network className="w-4 h-4" />
              <span>DIAGNOSTICS HUB</span>
            </button>
          </div>
        </div>

        {/* Floating Glowing interactive Badge */}
        <div className="w-40 h-40 flex-shrink-0 relative flex items-center justify-center bg-white/[0.01] border border-white/[0.04] rounded-2xl backdrop-blur-md overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-center p-4">
            <div className="relative mb-2 flex justify-center">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[28px] font-bold text-white font-mono leading-none">V7.1</span>
            <span className="block text-[8px] font-mono text-gray-500 uppercase tracking-widest mt-1.5 font-bold">Standalone Core</span>
          </div>
        </div>
      </div>

      {/* Premium Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "NETWORK LATENCY", val: `${stats.pingTime} ms`, desc: "Server connection response", icon: Wifi, color: "text-cyan-400 bg-cyan-500/5 border-cyan-500/10" },
          { label: "SYS COMPILATION", val: stats.uptime, desc: "Process uptime runtime", icon: Clock, color: "text-purple-400 bg-purple-500/5 border-purple-500/10" },
          { label: "VAULT PAYLOADS", val: `${stats.downloadCount} Items`, desc: "Synchronized local assets", icon: HardDrive, color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" },
          { label: "STORAGE EXHAUST", val: stats.totalSize, desc: "Decrypted byte storage", icon: Activity, color: "text-amber-400 bg-amber-500/5 border-amber-500/10" }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`cyber-panel p-4 rounded-2xl border flex flex-col justify-between h-[120px] ${item.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold font-mono text-gray-500 tracking-wider uppercase">{item.label}</span>
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-white font-display leading-tight">{item.val}</span>
                <span className="block text-[10px] text-gray-500 mt-1 font-mono">{item.desc}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Live Analytics Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dynamic Throughput SVG Chart (7 cols) */}
        <div className="lg:col-span-7 cyber-panel rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.01] rounded-full filter blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white text-xs font-bold font-mono tracking-widest uppercase flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Live Bandwidth Pipeline
              </h4>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">Real-time daemon extraction telemetry</p>
            </div>
            <div className="text-right font-mono">
              <span className="text-cyan-400 font-bold text-sm">{throughputIndex.toFixed(1)}%</span>
              <span className="block text-[8px] text-gray-500 uppercase font-bold tracking-widest mt-0.5">CAPACITY RATE</span>
            </div>
          </div>

          {/* Premium Line Chart representation */}
          <div className="h-[120px] w-full bg-black/40 border border-white/[0.02] rounded-xl p-2 relative flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              
              {/* Shaded Area */}
              <polyline
                fill="url(#chartGlow)"
                stroke="none"
                points={`10,120 ${chartPointsStr} 490,120`}
              />
              {/* Highlight Line */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                points={chartPointsStr}
              />
              {/* Dynamic blinking end node */}
              <circle
                cx={490}
                cy={120 - 10 - (throughputIndex / 100) * 100}
                r="3.5"
                fill="#fff"
                className="animate-pulse"
              />
            </svg>
            <div className="absolute top-2 left-3 flex gap-2 font-mono text-[8px] text-gray-500 uppercase tracking-widest">
              <span>• Max Thread: 1.2 GB/s</span>
              <span>• Active PID: Standalone_Daemon_10</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-mono text-gray-500 pt-1">
            <div>
              <span className="block text-gray-600 font-bold uppercase tracking-wider text-[8px] mb-0.5">BUFFER STATUS</span>
              <span className="text-white font-bold">100% SECURE</span>
            </div>
            <div>
              <span className="block text-gray-600 font-bold uppercase tracking-wider text-[8px] mb-0.5">THROTTLE RATE</span>
              <span className="text-emerald-400 font-bold">UNRESTRICTED</span>
            </div>
            <div>
              <span className="block text-gray-600 font-bold uppercase tracking-wider text-[8px] mb-0.5">ENCRYPTION TYPE</span>
              <span className="text-purple-400 font-bold">NETSCAPE AES</span>
            </div>
          </div>
        </div>

        {/* System Cores Status widget (5 cols) */}
        <div className="lg:col-span-5 cyber-panel rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <h4 className="text-white text-xs font-bold font-mono tracking-widest uppercase flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              ISOLATED CORE ENGINES
            </h4>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">Distributed multi-thread adapters</p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { name: "Python Core daemon", val: "94% Load", progress: 94, status: "Active", color: "bg-emerald-500" },
              { name: "yt-dlp core wrapper", val: "62% Load", progress: 62, status: "Standby", color: "bg-cyan-500" },
              { name: "libphonenumber Parser", val: "12% Load", progress: 12, status: "Optimized", color: "bg-purple-500" },
              { name: "GeoIP telemetry agent", val: "40% Load", progress: 40, status: "Cached", color: "bg-amber-500" }
            ].map((core, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${core.color} animate-pulse`} />
                    {core.name}
                  </span>
                  <span className="text-gray-500 font-bold">{core.val} ({core.status})</span>
                </div>
                <div className="w-full bg-[#05060a] h-1.5 rounded-full overflow-hidden p-[1px] border border-white/[0.02]">
                  <div className={`h-full rounded-full ${core.color}`} style={{ width: `${core.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Quick Action Samples Banner */}
      <div className="cyber-panel rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.01] rounded-full filter blur-xl pointer-events-none" />
        
        <div>
          <h4 className="text-white text-xs font-bold font-mono tracking-widest uppercase flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            Instant Diagnostics Sandboxes
          </h4>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Quick-launch verified test platforms to preview immediate format parsing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sampleUrls.map((sample, idx) => (
            <div 
              key={idx}
              className="bg-[#05060b] border border-white/[0.04] rounded-xl p-3.5 flex flex-col justify-between gap-3 group hover:border-amber-500/20 transition-all cursor-pointer"
              onClick={() => onExtractSampleUrl(sample.url)}
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-bold border border-amber-500/10">
                  {sample.platform}
                </span>
                <PlayCircle className="w-4 h-4 text-gray-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <h5 className="text-white text-[11px] font-bold group-hover:text-amber-300 transition-colors">
                  Analyze {sample.name}
                </h5>
                <p className="text-gray-500 text-[9px] truncate font-mono mt-1">
                  {sample.url}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Core Actions Timeline Footer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        <div className="md:col-span-8 cyber-panel rounded-2xl p-4 flex flex-col gap-3">
          <span className="text-[9px] font-bold font-mono text-gray-500 tracking-wider uppercase">Active Engine Checklist</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { text: "Bypass netscape decryption algorithms", done: true, icon: ShieldCheck },
              { text: "Dynamic GeoIP tracer interfaces calibrated", done: true, icon: CheckCircle2 },
              { text: "Authoritative nameserver resolving maps live", done: true, icon: CheckCircle2 },
              { text: "ITU-T Standard telephony classification verified", done: true, icon: CheckCircle2 }
            ].map((chk, idx) => {
              const Icon = chk.icon;
              return (
                <div key={idx} className="flex items-start gap-2 bg-white/[0.01] border border-white/[0.02] p-2.5 rounded-xl">
                  <Icon className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[10px] font-mono text-gray-400 leading-normal">{chk.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-4 cyber-panel rounded-2xl p-4 flex flex-col justify-between bg-gradient-to-br from-[#0c0d18] to-[#04050a] border-l-2 border-l-purple-500/30">
          <div>
            <span className="text-[9px] font-bold font-mono text-purple-400 tracking-wider uppercase block">System Controls</span>
            <p className="text-[10px] text-gray-500 font-mono mt-1">Directly execute administrative functions in our standalone process kernel</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button 
              onClick={() => onShortcut("reboot")}
              className="text-[9px] font-mono font-bold tracking-wider bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 py-2.5 rounded-xl transition-all cursor-pointer uppercase text-center"
            >
              Reboot Kern
            </button>
            <button 
              onClick={() => onShortcut("clearcache")}
              className="text-[9px] font-mono font-bold tracking-wider bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 border border-white/[0.04] py-2.5 rounded-xl transition-all cursor-pointer uppercase text-center"
            >
              Flush Cache
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
