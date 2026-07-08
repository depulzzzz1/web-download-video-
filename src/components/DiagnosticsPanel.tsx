import { useState } from "react";
import { 
  Globe, Phone, Server, Search, RefreshCw, Compass, MapPin, 
  Smartphone, CornerDownRight, AlertTriangle, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IpLookupResult, PhoneAnalysisResult, DnsResult } from "../types";

interface DiagnosticsPanelProps {
  networkSubTab: "ip" | "phone" | "dns";
  setNetworkSubTab: (tab: "ip" | "phone" | "dns") => void;
  ipInput: string;
  setIpInput: (ip: string) => void;
  isIpLoading: boolean;
  ipResult: IpLookupResult | null;
  handleIpLookup: () => void;
  phoneInput: string;
  setPhoneInput: (phone: string) => void;
  phoneRegion: string;
  setPhoneRegion: (region: string) => void;
  isPhoneLoading: boolean;
  phoneResult: PhoneAnalysisResult | null;
  handlePhoneLookup: () => void;
  dnsInput: string;
  setDnsInput: (dns: string) => void;
  isDnsLoading: boolean;
  dnsResult: DnsResult | null;
  handleDnsLookup: () => void;
  handleDnsIpLookup: (ip: string) => void;
}

export default function DiagnosticsPanel({
  networkSubTab, setNetworkSubTab,
  ipInput, setIpInput, isIpLoading, ipResult, handleIpLookup,
  phoneInput, setPhoneInput, phoneRegion, setPhoneRegion, isPhoneLoading, phoneResult, handlePhoneLookup,
  dnsInput, setDnsInput, isDnsLoading, dnsResult, handleDnsLookup, handleDnsIpLookup
}: DiagnosticsPanelProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Diagnostics Hub Navigation Subtabs Selector */}
      <div className="flex gap-2 bg-[#05060b]/60 p-1.5 rounded-2xl border border-white/[0.04] backdrop-blur-xl">
        <button
          onClick={() => setNetworkSubTab("ip")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold font-mono tracking-widest uppercase transition-all cursor-pointer ${
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
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold font-mono tracking-widest uppercase transition-all cursor-pointer ${
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
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold font-mono tracking-widest uppercase transition-all cursor-pointer ${
            networkSubTab === "dns"
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>DNS Resolver</span>
        </button>
      </div>

      {/* Dynamic Subtabs Displays */}
      <AnimatePresence mode="wait">
        
        {/* Subtab 1: GeoIP Locator */}
        {networkSubTab === "ip" && (
          <motion.div
            key="geoipView"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="cyber-panel cyber-panel-cyan rounded-3xl p-6 flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 border-b border-white/[0.04] pb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Globe className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white text-xs font-bold font-mono tracking-widest uppercase">
                  GeoIP Telemetry Mapper
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">Approximate coordinate tracking agent</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Query global AS-registration networks to locate host configurations. Retrieves ISP, state/city locality, and geocoordinates mapping indexes.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="ENTER HOST IP ADDRESS (e.g. 8.8.8.8)..."
                className="flex-1 bg-[#05060b] border border-white/[0.06] hover:border-cyan-500/20 rounded-2xl px-4 py-4 text-xs focus:outline-none focus:border-cyan-500/50 text-cyan-300 font-mono tracking-wider transition-colors placeholder:text-gray-700"
              />
              <button
                onClick={handleIpLookup}
                disabled={isIpLoading}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-[#05060b] disabled:text-gray-600 disabled:border-white/[0.02] text-white font-bold font-sans text-xs px-6 py-4 sm:py-0 rounded-2xl border border-transparent transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 active:scale-95"
              >
                {isIpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>TRACE LOC</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              
              {/* Left results card */}
              <div className="md:col-span-5 bg-[#05060b]/60 border border-white/[0.04] rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.01] rounded-full filter blur-xl pointer-events-none" />
                
                {ipResult ? (
                  <div className="flex flex-col gap-3 font-mono text-[11px] leading-relaxed relative z-10">
                    <div className="border-b border-white/[0.04] pb-2 flex justify-between">
                      <span className="text-gray-500 uppercase tracking-wider font-bold">Trace Target:</span>
                      <span className="text-cyan-400 font-bold">{ipResult.ip}</span>
                    </div>

                    {ipResult.error ? (
                      <div className="text-rose-400 font-semibold py-6 text-center flex flex-col items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">TRACE OVERFLOW: {ipResult.error}</span>
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
                        <div className="flex justify-between gap-2 border-t border-white/[0.04] pt-2 text-[10px]">
                          <span className="text-amber-500 font-bold flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                            Active Geolocation Lock
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-600 font-mono">
                    <Compass className="w-8 h-8 text-gray-700 animate-spin-slow mb-2" />
                    <span className="text-[9px] uppercase tracking-wider font-bold">No tracer payload loaded</span>
                  </div>
                )}
              </div>

              {/* Right Coordinate / Map plane representation */}
              <div className="md:col-span-7 bg-[#05060b]/40 border border-white/[0.04] rounded-2xl p-4 min-h-[160px] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
                  backgroundImage: "radial-gradient(circle, #06b6d4 1.5px, transparent 1.5px)",
                  backgroundSize: "16px 16px"
                }} />

                {ipResult && !ipResult.error ? (
                  <div className="w-full h-full flex flex-col justify-between relative z-10">
                    <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
                      <MapPin className="w-4 h-4 text-cyan-400 animate-bounce" />
                      <span className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">Coordinates mapping lock</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
                      <div className="absolute w-12 h-12 bg-cyan-500/10 rounded-full border border-cyan-500/30 animate-ping pointer-events-none" />
                      <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/80 flex items-center justify-center font-mono font-bold text-cyan-400 text-[10px]">
                        LOC
                      </div>
                      <span className="text-[9px] text-cyan-400 font-mono font-bold tracking-widest uppercase mt-3 bg-cyan-950/20 border border-cyan-500/10 px-2 py-0.5 rounded-md">
                        LAT: {ipResult.latitude || "Approx"} / LON: {ipResult.longitude || "Approx"}
                      </span>
                    </div>
                    <div className="text-[8px] text-gray-600 font-mono text-center">
                      Telemetry coordinates parsed securely via global lookup database blocks.
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center text-gray-700 font-mono p-6">
                    <MapPin className="w-8 h-8 text-gray-800 mb-2 animate-pulse" />
                    <span className="text-[9px] uppercase tracking-wider font-bold">Location maps offline</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Subtab 2: Phone Parser */}
        {networkSubTab === "phone" && (
          <motion.div
            key="phoneView"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="cyber-panel cyber-panel-cyan rounded-3xl p-6 flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 border-b border-white/[0.04] pb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Phone className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white text-xs font-bold font-mono tracking-widest uppercase">
                  ITU-T Telephony Analyzer
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">Global calling prefix structures validator</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Analyze numeric calling strings against E.164 ITU international Recommendations. Validates mobile carriers, geographical origins, and structural formats.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <select
                value={phoneRegion}
                onChange={(e) => setPhoneRegion(e.target.value)}
                className="bg-[#05060b] border border-white/[0.06] rounded-2xl px-3 py-4 text-xs font-mono font-bold text-cyan-300 focus:outline-none sm:w-[150px] cursor-pointer focus:border-cyan-500/30 transition-colors"
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
                className="flex-1 bg-[#05060b] border border-white/[0.06] hover:border-cyan-500/20 rounded-2xl px-4 py-4 text-xs focus:outline-none focus:border-cyan-500/50 text-cyan-300 font-mono tracking-wider transition-colors placeholder:text-gray-700"
              />
              <button
                onClick={handlePhoneLookup}
                disabled={isPhoneLoading}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-[#05060b] disabled:text-gray-600 disabled:border-white/[0.02] text-white font-bold font-sans text-xs px-6 py-4 sm:py-0 rounded-2xl border border-transparent transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 active:scale-95"
              >
                {isPhoneLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>ANALYZE</span>
              </button>
            </div>

            {phoneResult && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-5"
              >
                {/* Visual classification */}
                <div className="md:col-span-4 bg-[#05060b]/60 border border-white/[0.04] rounded-2xl p-4 flex flex-col justify-between items-center relative min-h-[160px]">
                  <div className="absolute top-2 left-2 text-[8px] text-gray-600 font-mono uppercase tracking-wider font-bold">Line Classification</div>
                  <Smartphone className={`w-12 h-12 mt-6 ${phoneResult.isValid ? "text-cyan-400" : "text-gray-700 animate-pulse"}`} />
                  <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest font-bold mt-2 bg-cyan-950/20 border border-cyan-500/10 px-2.5 py-0.5 rounded-md">
                    {phoneResult.type || "UNKNOWN TYPE"}
                  </span>
                </div>

                {/* Classification Table */}
                <div className="md:col-span-8 bg-[#05060b]/40 border border-white/[0.04] rounded-2xl p-4 flex flex-col gap-3 font-mono text-[11px] leading-relaxed">
                  <div className="border-b border-white/[0.04] pb-2 flex justify-between">
                    <span className="text-gray-500 uppercase font-bold">Input Payload String:</span>
                    <span className="text-cyan-400 font-bold">{phoneResult.input}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-500">Structure Valid:</span>
                        <span className={`font-bold uppercase ${phoneResult.isValid ? "text-emerald-400" : "text-rose-500"}`}>
                          {phoneResult.isValid ? "TRUE" : "FALSE"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-500">E.164 Standard:</span>
                        <span className="text-white font-bold">{phoneResult.number || "N/A"}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-500">ITU ISO Country:</span>
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
          </motion.div>
        )}

        {/* Subtab 3: DNS Resolver */}
        {networkSubTab === "dns" && (
          <motion.div
            key="dnsView"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="cyber-panel cyber-panel-cyan rounded-3xl p-6 flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 border-b border-white/[0.04] pb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Server className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white text-xs font-bold font-mono tracking-widest uppercase">
                  DNS Authority Resolver
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">Authoritative hostname address mapper</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Resolve hostnames into registered public active A-record IPv4 strings. From there, instantly pipe records back into our GeoIP trace router.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={dnsInput}
                onChange={(e) => setDnsInput(e.target.value)}
                placeholder="ENTER TARGET HOSTNAME DOMAIN (e.g. google.com)..."
                className="flex-1 bg-[#05060b] border border-white/[0.06] hover:border-cyan-500/20 rounded-2xl px-4 py-4 text-xs focus:outline-none focus:border-cyan-500/50 text-cyan-300 font-mono tracking-wider transition-colors placeholder:text-gray-700"
              />
              <button
                onClick={handleDnsLookup}
                disabled={isDnsLoading}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-[#05060b] disabled:text-gray-600 disabled:border-white/[0.02] text-white font-bold font-sans text-xs px-6 py-4 sm:py-0 rounded-2xl border border-transparent transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 active:scale-95"
              >
                {isDnsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>RESOLVE</span>
              </button>
            </div>

            {dnsResult && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#05060b]/60 border border-white/[0.04] rounded-2xl p-4 flex flex-col gap-3 font-mono text-[11px] leading-relaxed"
              >
                <div className="border-b border-white/[0.04] pb-2 flex justify-between">
                  <span className="text-gray-500 uppercase font-bold">Domain Source Name:</span>
                  <span className="text-cyan-400 font-bold">{dnsResult.hostname}</span>
                </div>

                <div className="flex flex-col gap-2.5 mt-1">
                  <span className="text-gray-500 uppercase tracking-widest font-bold text-[9px]">Resolved A-Record Addresses:</span>
                  {dnsResult.addresses && dnsResult.addresses.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {dnsResult.addresses.map((addr, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-[#07080f] border border-white/[0.04] p-3 rounded-xl hover:border-cyan-500/20 transition-all">
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
                    <span className="text-gray-600 text-[10px] italic">No active name server mapping records returned.</span>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
