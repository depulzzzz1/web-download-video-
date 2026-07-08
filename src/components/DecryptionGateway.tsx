import { VideoInfo, TaskStatus } from "../types";
import { 
  Download, Search, Sparkles, X, Video, Music, RefreshCw, 
  Clock, AlertTriangle, ShieldCheck, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DecryptionGatewayProps {
  url: string;
  setUrl: (url: string) => void;
  detectedPlatform: string;
  isExtracting: boolean;
  extractedInfo: VideoInfo | null;
  setExtractedInfo: (info: VideoInfo | null) => void;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  downloadMode: "video" | "audio";
  setDownloadMode: (mode: "video" | "audio") => void;
  videoQuality: string;
  setVideoQuality: (quality: string) => void;
  activeTask: TaskStatus | null;
  isPolling: boolean;
  handleExtract: () => void;
  handleStartDownload: (customFormatId?: string) => void;
}

export default function DecryptionGateway({
  url, setUrl, detectedPlatform, isExtracting, extractedInfo, setExtractedInfo,
  selectedFormat, setSelectedFormat, downloadMode, setDownloadMode,
  videoQuality, setVideoQuality, activeTask, isPolling, handleExtract, handleStartDownload
}: DecryptionGatewayProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Decryption Panel Card */}
      <div className="cyber-panel cyber-panel-green rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white text-xs font-bold font-mono tracking-widest uppercase">
                Isolated Stream Parser
              </h3>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">Decrypt direct formats bypass</p>
            </div>
          </div>
          <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-xl border border-emerald-500/10 font-bold tracking-widest uppercase">
            {detectedPlatform}
          </span>
        </div>

        <p className="text-xs text-gray-400 font-sans leading-relaxed">
          Input an active social media link below. Our high-performance extraction daemons automatically run Netscape-wrapped cookies arrays to parse multi-rate video resolutions or raw digital audio streams.
        </p>

        {/* Input area */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="PASTE INSTAGRAM, TIKTOK, YOUTUBE OR TWITTER/X URL PAYLOAD..."
              className="w-full bg-[#05060b] border border-white/[0.06] hover:border-emerald-500/20 rounded-2xl px-4 py-4 text-xs focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600 font-mono text-emerald-400 tracking-wider"
            />
            {url && (
              <button 
                onClick={() => setUrl("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleExtract}
            disabled={isExtracting || !url}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#05060b] disabled:text-gray-600 disabled:border-white/[0.02] text-white font-bold font-sans text-xs px-6 py-4 sm:py-0 rounded-2xl border border-transparent disabled:border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            {isExtracting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>ANALYZE</span>
          </button>
        </div>

        {/* Configurations Preset selector panel when formats are not loaded */}
        {!extractedInfo && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/[0.04]">
            
            {/* Download Mode Toggle */}
            <div className="bg-[#05060b]/40 border border-white/[0.04] rounded-2xl p-3 flex flex-col gap-1.5 text-center justify-center">
              <span className="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-widest">Stream Format</span>
              <div className="flex gap-1 justify-center mt-1">
                <button 
                  onClick={() => setDownloadMode("video")}
                  className={`text-[9px] font-bold px-3 py-1.5 rounded-lg border font-mono tracking-wider transition-all cursor-pointer ${
                    downloadMode === "video" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-transparent text-gray-500 border-transparent hover:text-gray-300"
                  }`}
                >
                  VIDEO
                </button>
                <button 
                  onClick={() => setDownloadMode("audio")}
                  className={`text-[9px] font-bold px-3 py-1.5 rounded-lg border font-mono tracking-wider transition-all cursor-pointer ${
                    downloadMode === "audio" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-transparent text-gray-500 border-transparent hover:text-gray-300"
                  }`}
                >
                  AUDIO
                </button>
              </div>
            </div>

            {/* Quality Select Preset */}
            <div className="bg-[#05060b]/40 border border-white/[0.04] rounded-2xl p-3 flex flex-col gap-1.5 text-center justify-center">
              <span className="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-widest">Max Quality</span>
              <select 
                value={videoQuality}
                onChange={(e) => setVideoQuality(e.target.value)}
                disabled={downloadMode === "audio"}
                className="bg-[#05060b] border border-white/[0.06] rounded-xl py-1.5 px-2 text-[10px] text-emerald-400 font-mono font-bold focus:outline-none text-center focus:border-emerald-500/30 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                <option value="best">BEST AVAILABLE</option>
                <option value="1080">1080P FHD</option>
                <option value="720">720P HD</option>
                <option value="480">480P SD</option>
              </select>
            </div>

            {/* Direct Fire bypass option */}
            <div className="bg-[#05060b]/40 border border-white/[0.04] rounded-2xl p-3 flex flex-col gap-1.5 text-center justify-center">
              <span className="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-widest">Direct Dispatch</span>
              <button
                onClick={() => handleStartDownload()}
                disabled={!url || isPolling}
                className="w-full bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] py-1.5 font-bold font-mono tracking-wider transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
              >
                HYPER FIRE
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Stream formats Card details */}
      <AnimatePresence>
        {extractedInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            className="cyber-panel rounded-3xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500/[0.02] to-transparent rounded-full filter blur-3xl pointer-events-none" />
            
            <button 
              onClick={() => setExtractedInfo(null)}
              className="absolute top-4 right-4 bg-gray-950/60 hover:bg-gray-900 text-gray-400 hover:text-white p-1.5 rounded-xl border border-white/[0.06] transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Thumbnail Preview Area */}
            <div className="w-full md:w-1/3 flex flex-col gap-3 flex-shrink-0">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/[0.04] relative group">
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
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/20 tracking-wider">
                  {extractedInfo.duration ? `${Math.floor(extractedInfo.duration / 60)}:${String(extractedInfo.duration % 60).padStart(2, "0")}` : "00:00"}
                </div>
              </div>
              <div className="bg-[#05060b] border border-white/[0.04] px-3.5 py-2.5 rounded-xl text-[10px] font-mono flex justify-between items-center">
                <span className="text-gray-500 uppercase tracking-widest font-bold">UPLOADER</span>
                <span className="text-emerald-400 font-bold max-w-[120px] truncate" title={extractedInfo.uploader}>{extractedInfo.uploader}</span>
              </div>
            </div>

            {/* Metadata detail information */}
            <div className="flex-1 flex flex-col gap-4 justify-between">
              <div>
                <h4 className="text-white font-bold leading-snug font-display text-base tracking-wide">{extractedInfo.title}</h4>
                <p className="text-[10px] text-gray-500 mt-2 max-h-16 overflow-y-auto font-sans leading-relaxed pr-1 scrollbar-thin">
                  {extractedInfo.description || "No metadata description retrieved for this stream."}
                </p>
              </div>

              {/* Advanced format selection selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-500">Select Decryption Payload Channel:</label>
                <div className="relative">
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full bg-[#05060b] border border-white/[0.04] focus:border-emerald-500/30 rounded-xl px-3 py-3 text-[11px] focus:outline-none text-emerald-400 font-mono tracking-wide cursor-pointer transition-colors"
                  >
                    {extractedInfo.formats && extractedInfo.formats.length > 0 ? (
                      extractedInfo.formats.map((f, idx) => (
                        <option key={idx} value={f.formatId}>
                          {f.resolution} ({f.ext.toUpperCase()}) - {f.filesize ? `${(f.filesize / (1024 * 1024)).toFixed(1)} MB` : "Unspecified Size"} {f.note ? `[${f.note}]` : ""}
                        </option>
                      ))
                    ) : (
                      <option value="best">Default Best Consolidated stream</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Format Dispatch triggers */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setDownloadMode("video");
                    handleStartDownload();
                  }}
                  disabled={isPolling}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-900 text-white font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95"
                >
                  <Video className="w-4 h-4" />
                  <span>DECRYPT VIDEO FORMAT</span>
                </button>
                <button
                  onClick={() => {
                    setDownloadMode("audio");
                    handleStartDownload();
                  }}
                  disabled={isPolling}
                  className="bg-[#0d0e18] border border-white/[0.06] hover:border-emerald-500/30 text-emerald-400 font-bold text-xs px-5 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Music className="w-4 h-4" />
                  <span>EXTRACT RAW MP3</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Polling Status download progress bar */}
      <AnimatePresence>
        {activeTask && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="cyber-panel cyber-panel-green rounded-3xl p-6 border-l-4 border-l-emerald-500 relative overflow-hidden"
          >
            {/* Animated neon spotlight pulse horizontal */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500/10 overflow-hidden">
              <div className="h-full w-24 bg-emerald-400 animate-[pulse_1.5s_infinite] rounded-full" />
            </div>

            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-xs font-bold font-mono tracking-widest uppercase">ACTIVE THREAD TRACING: {activeTask.status}</h4>
                  <p className="text-[10px] text-gray-400 truncate max-w-sm sm:max-w-md font-mono mt-1 font-semibold">{activeTask.title}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-emerald-400 font-mono font-bold text-sm">{activeTask.progress.toFixed(1)}%</span>
              </div>
            </div>

            {/* Styled dual progress track */}
            <div className="w-full bg-[#05060b] h-3 rounded-full overflow-hidden border border-white/[0.04] p-[2px]">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${activeTask.progress}%` }}
              />
            </div>

            {/* Technical metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-mono text-gray-500 mt-4 border-t border-white/[0.04] pt-3">
              <div>
                <span className="block uppercase text-[8px] text-gray-600 font-bold tracking-widest mb-1">BANDWIDTH VELOCITY</span>
                <span className="text-emerald-400 font-bold text-xs">{activeTask.speed}</span>
              </div>
              <div>
                <span className="block uppercase text-[8px] text-gray-600 font-bold tracking-widest mb-1">REMAINING INTERVAL</span>
                <span className="text-emerald-400 font-bold text-xs">{activeTask.eta}</span>
              </div>
              <div>
                <span className="block uppercase text-[8px] text-gray-600 font-bold tracking-widest mb-1">ISOLATED CORE</span>
                <span className="text-emerald-400 font-bold text-xs">THREAD #T-99</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
