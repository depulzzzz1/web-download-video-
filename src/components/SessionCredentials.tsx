import { useState, DragEvent } from "react";
import { 
  ShieldAlert, CheckCircle2, ShieldCheck, Trash2, 
  Upload, HelpCircle, FileText, AlertTriangle
} from "lucide-react";
import { motion } from "motion/react";

interface SessionCredentialsProps {
  cookieStatus: {
    exists: boolean;
    lineCount: number;
    updatedAt: string | null;
  };
  onSaveCookies: (text: string) => void;
  onDeleteCookies: () => void;
}

export default function SessionCredentials({
  cookieStatus, onSaveCookies, onDeleteCookies
}: SessionCredentialsProps) {
  const [cookieText, setCookieText] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = () => {
    if (!cookieText.trim()) return;
    onSaveCookies(cookieText);
    setCookieText("");
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          onSaveCookies(text);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Session Credentials Panel Card */}
      <div className="cyber-panel cyber-panel-amber rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full filter blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white text-xs font-bold font-mono tracking-widest uppercase">
                Session Credentials Manager
              </h3>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">Netscape cookies.txt authentication engine</p>
            </div>
          </div>
          
          {/* Real time status chip */}
          <span className={`text-[9px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-xl border ${
            cookieStatus.exists 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" 
              : "bg-rose-500/10 text-rose-400 border-rose-500/10"
          }`}>
            {cookieStatus.exists ? "AUTHENTICATED" : "BYPASSED"}
          </span>
        </div>

        <p className="text-xs text-gray-400 font-sans leading-relaxed">
          TikTok, Youtube, and premium video publishers enforce geographical IP challenges or registration gatekeeper layers. Inject a Netscape formatted cookies text block below to authorize downloader wrappers instantly.
        </p>

        {/* Drag and Drop Box and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          
          {/* Input text and drop field (7 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full bg-[#05060b] border rounded-2xl p-4 flex flex-col gap-3 transition-all relative ${
                isDragging 
                  ? "border-amber-400/80 bg-amber-500/[0.02] scale-[0.99]" 
                  : "border-white/[0.06] hover:border-amber-500/20 focus-within:border-amber-500/50"
              }`}
            >
              {isDragging && (
                <div className="absolute inset-0 bg-amber-950/20 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center text-amber-400 font-mono z-20 pointer-events-none">
                  <Upload className="w-8 h-8 animate-bounce mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">DROP COOKIES FILE DIRECTLY</span>
                </div>
              )}

              <textarea
                value={cookieText}
                onChange={(e) => setCookieText(e.target.value)}
                placeholder="# Netscape HTTP Cookie File&#10;# This is a generated file! Do not edit.&#10;.youtube.com&#10;TRUE&#10;/&#10;FALSE&#10;1740000000&#10;SID&#10;..."
                rows={6}
                className="w-full bg-transparent border-none text-[10px] text-amber-400 focus:outline-none placeholder:text-gray-700 font-mono resize-none leading-relaxed scrollbar-thin"
              />

              <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/[0.03] pt-3 gap-3">
                <span className="text-[9px] font-mono text-gray-600 uppercase font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Supports Drag & Drop cookies.txt files
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!cookieText.trim()}
                  className="bg-amber-600 hover:bg-amber-500 disabled:bg-[#05060b] disabled:text-gray-600 disabled:border-white/[0.02] text-white font-bold font-sans text-xs px-5 py-2.5 rounded-xl border border-transparent disabled:border transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  <FileText className="w-4 h-4" />
                  <span>INJECT CREDENTIALS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Installed Info card (4 cols) */}
          <div className="lg:col-span-4 bg-[#05060b]/40 border border-white/[0.04] rounded-2xl p-4 flex flex-col justify-between min-h-[180px]">
            <div>
              <span className="text-[9px] font-bold font-mono text-gray-500 tracking-wider uppercase block">Credentials Manifest</span>
              {cookieStatus.exists ? (
                <div className="flex flex-col gap-3 mt-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-bold">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 animate-pulse" />
                    <span>CREDENTIAL PAYLOAD INJECTED</span>
                  </div>
                  <div className="flex flex-col gap-2 font-mono text-[10px] text-gray-400 leading-normal border-t border-white/[0.04] pt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Record Length:</span>
                      <span className="text-white font-bold">{cookieStatus.lineCount} Lines</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Synced:</span>
                      <span className="text-white font-bold truncate max-w-[100px]" title={cookieStatus.updatedAt || "N/A"}>{cookieStatus.updatedAt ? new Date(cookieStatus.updatedAt).toLocaleDateString() : "N/A"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-3">
                  <div className="flex items-center gap-2 text-amber-500 font-mono text-[11px] font-bold">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>BYPASS COOKIES ABSENT</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono leading-normal border-t border-white/[0.04] pt-2">
                    Running default anonymous headers. Some restricted or private media objects may prompt decryption errors.
                  </p>
                </div>
              )}
            </div>

            {cookieStatus.exists && (
              <button
                onClick={onDeleteCookies}
                className="w-full bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white py-2.5 rounded-xl text-[9px] font-bold font-mono tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase mt-4"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>WIPE CREDENTIALS</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
