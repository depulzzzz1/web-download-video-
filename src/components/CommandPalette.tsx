import { useState, useEffect, useRef } from "react";
import { Search, Terminal, Navigation, RefreshCw, Cpu, Layers, ShieldAlert, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: "dashboard" | "downloader" | "network" | "library" | "cookies") => void;
  onShortcut: (action: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate, onShortcut }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const items = [
    {
      category: "Navigation",
      commands: [
        { id: "nav-dash", title: "Go to Telemetry Dashboard", desc: "View real-time statistics and activity indices", icon: Cpu, action: () => onNavigate("dashboard") },
        { id: "nav-dl", title: "Go to Decryption Gateway", desc: "Download high-speed video/audio formats", icon: Layers, action: () => onNavigate("downloader") },
        { id: "nav-diag", title: "Go to Network Diagnostics", desc: "GeoIP locators, DNS resolver, and phone parser", icon: Navigation, action: () => onNavigate("network") },
        { id: "nav-vault", title: "Go to Standalone Asset Vault", desc: "View and manage downloaded media objects", icon: Search, action: () => onNavigate("library") },
        { id: "nav-cook", title: "Go to Session Credentials", desc: "Inject Netscape cookies.txt authentication", icon: ShieldAlert, action: () => onNavigate("cookies") },
      ]
    },
    {
      category: "System Actions",
      commands: [
        { id: "act-reboot", title: "Reboot Cyber Core Kernel", desc: "Reset and recalibrate standalone engines", icon: RefreshCw, action: () => { onShortcut("reboot"); onClose(); } },
        { id: "act-clear", title: "Flush Live Terminal Logs", desc: "Wipe diagnostics display cache", icon: Terminal, action: () => { onShortcut("clearcache"); onClose(); } },
        { id: "act-sync", title: "Sync Asset Vault Database", desc: "Re-index active file directory", icon: Layers, action: () => { onShortcut("dbstatus"); onClose(); } },
      ]
    }
  ];

  const filteredItems = items.map(cat => ({
    category: cat.category,
    commands: cat.commands.filter(cmd => 
      cmd.title.toLowerCase().includes(search.toLowerCase()) ||
      cmd.desc.toLowerCase().includes(search.toLowerCase()) ||
      cat.category.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.commands.length > 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
        {/* Backdrop glass blur */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#020306]/85 backdrop-blur-md z-[-1]"
        />

        {/* Floating Command Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="w-full max-w-lg bg-[#0a0c14]/95 border border-white/[0.06] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[450px]"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search navigation, systems, and utilities..."
              className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none placeholder:text-gray-600 font-sans tracking-wide"
            />
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Matches List */}
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-gray-600 font-mono text-[11px] uppercase tracking-wider">
                No matching systems located
              </div>
            ) : (
              filteredItems.map(cat => (
                <div key={cat.category} className="mb-2.5">
                  <span className="px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono block">
                    {cat.category}
                  </span>
                  <div className="flex flex-col gap-0.5 mt-1">
                    {cat.commands.map(cmd => {
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.id}
                          onClick={cmd.action}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/[0.03] active:bg-white/[0.05] flex items-center gap-3 group transition-all cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.08] text-gray-400 group-hover:text-emerald-400 transition-colors flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-white text-[11px] font-semibold group-hover:text-emerald-300 transition-colors">
                              {cmd.title}
                            </h5>
                            <p className="text-gray-500 text-[10px] truncate mt-0.5 font-sans">
                              {cmd.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick instructions Footer */}
          <div className="bg-[#05060a] px-4 py-2 flex justify-between items-center text-[9px] font-mono text-gray-600 border-t border-white/[0.03]">
            <span>PRESS <kbd className="bg-white/10 px-1 py-0.5 rounded text-[8px]">ESC</kbd> TO EXIT</span>
            <span>USE <kbd className="bg-white/10 px-1 py-0.5 rounded text-[8px]">UP/DOWN</kbd> KEYBOARDS</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
