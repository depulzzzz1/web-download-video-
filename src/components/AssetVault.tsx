import { DownloadRecord } from "../types";
import { 
  Layers, RefreshCw, AlertTriangle, Music, Video, 
  Download, Trash2, Search, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface AssetVaultProps {
  history: DownloadRecord[];
  isLoadingHistory: boolean;
  loadHistory: () => void;
  handleDeleteFile: (id: string, name: string) => void;
}

export default function AssetVault({
  history, isLoadingHistory, loadHistory, handleDeleteFile
}: AssetVaultProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "video" | "audio">("all");

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(filterQuery.toLowerCase()) || 
                          item.ext.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesType = filterType === "all" || item.mode === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Standalone Asset Vault Panel Card */}
      <div className="cyber-panel cyber-panel-purple rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.02] rounded-full filter blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white text-xs font-bold font-mono tracking-widest uppercase">
                Standalone Asset Vault
              </h3>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">Secure local content caches map</p>
            </div>
          </div>
          <button 
            onClick={loadHistory}
            disabled={isLoadingHistory}
            className="bg-[#05060b] border border-white/[0.06] hover:border-purple-500/30 text-purple-400 p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            title="Refresh Vault Database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="SEARCH FILES BY TITLE OR FORMAT EXTENSION..."
              className="w-full bg-[#05060b] border border-white/[0.04] rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-purple-500/50 text-purple-300 font-mono tracking-wider placeholder:text-gray-700 transition-colors"
            />
          </div>

          {/* Type filters */}
          <div className="flex bg-[#05060b]/60 border border-white/[0.04] p-1 rounded-xl">
            {(["all", "video", "audio"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  filterType === type 
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                    : "text-gray-500 hover:text-gray-300 border border-transparent"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Core items timeline list */}
        {isLoadingHistory ? (
          <div className="h-44 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center gap-2 bg-[#05060b]/20 rounded-2xl border border-dashed border-white/[0.04] p-6">
            <AlertTriangle className="w-8 h-8 text-gray-700 mb-1" />
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-bold">No assets found matching filters</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
            <AnimatePresence initial={false}>
              {filteredHistory.map((record) => (
                <motion.div 
                  key={record.id}
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 250 }}
                  className="bg-[#05060b]/60 border border-white/[0.04] hover:border-purple-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all overflow-hidden"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="bg-purple-950/10 border border-purple-500/20 p-2.5 rounded-xl text-purple-400 flex items-center justify-center mt-1">
                      {record.mode === "audio" ? <Music className="w-4 h-4 animate-pulse" /> : <Video className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-white text-xs font-bold leading-tight truncate max-w-sm" title={record.title}>
                        {record.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9px] font-mono text-gray-500 mt-2">
                        <span className="bg-purple-950/20 px-1.5 py-0.5 rounded text-purple-400 uppercase font-bold tracking-widest border border-purple-500/10">{record.ext}</span>
                        <span>|</span>
                        <span>QUALITY: {record.quality.toUpperCase()}</span>
                        <span>|</span>
                        <span>SIZE: {(record.size / (1024 * 1024)).toFixed(1)} MB</span>
                        <span>|</span>
                        <span>RESOLVED: {new Date(record.addedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vault Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <a
                      href={`/api/download/file/${record.id}`}
                      download
                      className="bg-purple-600/15 hover:bg-purple-600 border border-purple-500/20 text-purple-400 hover:text-white px-3.5 py-2 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>GET PAYLOAD</span>
                    </a>
                    <button
                      onClick={() => handleDeleteFile(record.id, record.title)}
                      className="bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white p-2.5 rounded-xl transition-all cursor-pointer"
                      title="Purge local storage asset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
