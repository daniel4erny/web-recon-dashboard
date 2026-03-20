"use client"

import LoggerTabs from "@/app/components/LoggerTabs";
import ScanProgressBars from "@/app/components/ScanProgressBars";
import PortsEndpointCounter from "@/app/components/PortsEndpointCounter";
import {useState} from "react";

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);

  const liveFetch = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          target: "google.com",
          key: "nf0g2zjarhdzw3l8aktyy033wmkf97jy"
        })
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        // Zpracování Server-Sent Events (SSE) formátu nebo běžných řádků
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const newLog = JSON.parse(line.replace('data: ', ''));
              setLogs((prev) => [...prev, newLog.text || JSON.stringify(newLog)]);
            } catch (e) {
              console.error("Parse error:", e);
            }
          } else if (line.trim().startsWith('{')) {
            // Pokud by server vracel rovnou JSON bez "data: "
            try {
              const newLog = JSON.parse(line);
              setLogs((prev) => [...prev, newLog.text || JSON.stringify(newLog)]);
            } catch (e) {
              console.error("Parse error:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="bg-background text-on-background font-body selection:bg-primary/30 min-h-screen flex flex-col">
      
      <main className="grow pt-12 pb-12 px-8 max-w-7xl mx-auto w-full">
        {/* Target Input Section */}
        <section className="mb-20">
          <div className="flex flex-col space-y-4 max-w-3xl mx-auto text-center mb-8">
            <h1 className="font-headline text-display-lg font-bold tracking-tight text-on-surface text-4xl">Initiate Network Probe</h1>
            <p className="text-on-surface-variant font-body">Enter a valid URL or IPv4/v6 address to begin a deep-packet inspection and port analysis.</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-primary-container/20 blur opacity-30"></div>
            <div className="relative flex items-center bg-surface-container-highest rounded-lg border border-outline-variant/10 p-2 shadow-2xl">
              <span className="material-symbols-outlined text-primary ml-4">shutter_speed</span>
              <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-mono py-4 px-6 text-lg placeholder:text-outline/50 outline-none" placeholder="https://target-node-01.internal or 192.168.1.1" type="text"/>
              <button className="bg-linear-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-lg font-headline font-bold uppercase tracking-wider text-sm transition-all hover:brightness-110 active:scale-95"
              onClick={liveFetch}>
                Start Scan
              </button>
            </div>
          </div>
        </section>

        {/* Monitoring Interface: Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Main Logs/Ports/Endpoints Panel */}
          <LoggerTabs info={logs}/>

          {/* Right Summary Panel */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* Posture & Counter Box */}
            <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10 shadow-lg bg-[#20201f]">
              <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 text-[#adaaaa]">Security Posture</h3>
              <PortsEndpointCounter />
              <ScanProgressBars />
            </div>

          </div>
        </div>
      </main>
      
      {/* Overlay Grid Texture for tactical feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-60" data-alt="Faint tactical grid pattern overlay" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
    </div>
  );
}