"use client";

import { useState } from "react";
import ConsoleLogger from "@/app/consoleLogger";
import PortInfo from "@/app/components/PortInfo";
import EndpointInfo from "@/app/components/EndpointInfo";

export default function LoggerTabs() {
  const [activeTab, setActiveTab] = useState<"logs" | "ports" | "endpoints">("logs");

  return (
    <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-xl overflow-hidden flex flex-col h-125 bg-[#1a1a1a]">
      <div className="px-6 py-4 bg-surface-container-high flex justify-between items-center border-b border-outline-variant/10 bg-[#20201f]">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-tertiary-fixed scan-pulse animate-pulse bg-[#00fc40]"></div>
            <span className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface">Live Operational Log</span>
          </div>

          <nav className="flex items-center space-x-4 ml-6 font-headline uppercase tracking-wider text-[10px]">
            <button 
              onClick={() => setActiveTab("logs")}
              className={`transition-transform active:scale-95 ${activeTab === "logs" ? "text-primary border-b border-primary pb-1 text-[#81ecff]" : "text-[#adaaaa] hover:text-[#81ecff]"}`}
            >
              Raw Logs
            </button>
            <button 
              onClick={() => setActiveTab("ports")}
              className={`transition-transform active:scale-95 ${activeTab === "ports" ? "text-primary border-b border-primary pb-1 text-[#81ecff]" : "text-[#adaaaa] hover:text-[#81ecff]"}`}
            >
              Ports
            </button>
            <button 
              onClick={() => setActiveTab("endpoints")}
              className={`transition-transform active:scale-95 ${activeTab === "endpoints" ? "text-primary border-b border-primary pb-1 text-[#81ecff]" : "text-[#adaaaa] hover:text-[#81ecff]"}`}
            >
              Endpoints
            </button>
          </nav>
        </div>
        
        <div className="flex space-x-4">
          <span className="font-mono text-[10px] text-primary text-[#81ecff]">BUFFER: 1024KB</span>
          <span className="font-mono text-[10px] text-tertiary text-[#9cff93]">UPTIME: 00:04:12:09</span>
        </div>
      </div>

      {/* Render active content */}
      <div className="grow overflow-hidden bg-surface-container-low/50 relative bg-[#131313]/50">
        {activeTab === "logs" && <ConsoleLogger />}
        {activeTab === "ports" && <PortInfo />}
        {activeTab === "endpoints" && <EndpointInfo />}
      </div>
    </div>
  );
}