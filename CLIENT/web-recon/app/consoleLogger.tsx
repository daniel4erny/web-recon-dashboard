"use client";

import { useEffect, useRef, useState } from "react";

// Types
interface LogMessage {
  id: string;
  timestamp: string;
  type: "INFO" | "SUCCESS" | "SCANNING" | "DETECTED" | "ALERT" | "ERROR";
  content: string;
  details?: string;
  highlight?: boolean;
}

// Dummy data generator for simulation
const generateLog = (): LogMessage => {
  const types: LogMessage["type"][] = ["INFO", "SUCCESS", "SCANNING", "DETECTED", "ALERT"];
  const type = types[Math.floor(Math.random() * types.length)];
  const now = new Date();
  const timestamp = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
  const id = Math.random().toString(36).substring(2, 9);
  
  const contents = {
    INFO: ["Subdomain found: dev.target-node-01.internal", "Handshake established with remote node.", "Initializing SENTINEL probe v4.0.2...", "Request timed out, retrying..."],
    SUCCESS: ["TLS certificate validated (v1.3 AES_256_GCM).", "Payload delivered successfully.", "Bypass confirmed on port 8080."],
    SCANNING: ["Probing standard ports (1-1024)...", "Enumerating subdomains...", "Analyzing HTTP headers..."],
    DETECTED: ["Port 80 (HTTP) - Nginx/1.18.0 (Ubuntu)", "Port 443 (HTTPS) - OpenSSL/1.1.1", "WAF presence detected (Cloudflare)."],
    ALERT: ["Potential XSS vulnerability identified on /api/v1/auth", "Exposed .git directory found!", "Rate limiting active, throttling requests..."]
  };
  
  return {
    id,
    timestamp,
    type,
    content: contents[type][Math.floor(Math.random() * contents[type].length)],
    highlight: type === "ALERT" || type === "DETECTED"
  };
};

export default function ConsoleLogger() {
  const [logs, setLogs] = useState<LogMessage[]>([
    { id: "1", timestamp: "[14:22:01]", type: "INFO", content: "Initializing SENTINEL probe v4.0.2..." },
    { id: "2", timestamp: "[14:22:02]", type: "INFO", content: "Handshake established with remote node." }
  ]);
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Simulate incoming logs
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, generateLog()];
        // Keep only last 100 logs to prevent memory issues
        return newLogs.length > 100 ? newLogs.slice(newLogs.length - 100) : newLogs;
      });
    }, 3000 + Math.random() * 4000); // Random interval between 3-7 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getTypeStyle = (type: LogMessage["type"]) => {
    switch(type) {
      case "INFO": return "text-[#00d4ec]"; // primary-fixed-dim
      case "SUCCESS": return "text-[#9cff93]"; // tertiary
      case "SCANNING": return "text-[#00d4ec]"; // primary-fixed-dim
      case "DETECTED": return "text-[#9cff93]"; // tertiary
      case "ALERT": return "text-[#d7383b]"; // error-dim
      case "ERROR": return "text-[#ff716c]"; // error
      default: return "text-[#00d4ec]";
    }
  };

  return (
    <div className="w-full h-full p-6 font-mono text-sm space-y-2 overflow-y-auto">
      {logs.map((log) => (
        <p key={log.id} className={`${log.highlight ? "text-on-surface" : "text-on-surface-variant"}`}>
          <span className="text-outline mr-2">{log.timestamp}</span> 
          <span className={`${getTypeStyle(log.type)} mr-2 font-bold`}>{log.type}:</span> 
          {log.content}
        </p>
      ))}
      
      <div className="animate-pulse flex space-x-1 mt-4">
        <span className="w-1 h-4 bg-[#81ecff]/40"></span>
        <span className="text-[#81ecff]/60">Listening for signals...</span>
      </div>
      
      {/* Invisible element to auto-scroll to */}
      <div ref={logsEndRef} />
    </div>
  );
}