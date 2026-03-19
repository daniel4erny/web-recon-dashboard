export default function ConsoleLogger(){
    return(
        <div className="grid grid-cols-12 gap-6">
            {/* Real-time Console Log */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-xl overflow-hidden flex flex-col h-[500px]">
                <div className="px-6 py-4 bg-surface-container-high flex justify-between items-center border-b border-outline-variant/10">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-tertiary-fixed scan-pulse animate-pulse"></div>
                        <span className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface">Live Operational Log</span>
                    </div>
                    <div className="flex space-x-4">
                        <span className="font-mono text-[10px] text-primary">BUFFER: 1024KB</span>
                        <span className="font-mono text-[10px] text-tertiary">UPTIME: 00:04:12:09</span>
                    </div>
                </div>
                <div className="flex-grow p-6 font-mono text-sm space-y-2 overflow-y-auto bg-surface-container-low/50">
                    <p className="text-on-surface-variant"><span className="text-outline">[14:22:01]</span> <span className="text-primary-fixed-dim text-[#00d4ec]">INFO:</span> Initializing SENTINEL probe v4.0.2...</p>
                    <p className="text-on-surface-variant"><span className="text-outline">[14:22:02]</span> <span className="text-primary-fixed-dim text-[#00d4ec]">INFO:</span> Handshake established with remote node.</p>
                    <p className="text-on-surface-variant"><span className="text-outline">[14:22:04]</span> <span className="text-tertiary text-[#9cff93]">SUCCESS:</span> TLS certificate validated (v1.3 AES_256_GCM).</p>
                    <p className="text-on-surface-variant"><span className="text-outline">[14:22:05]</span> <span className="text-primary-fixed-dim text-[#00d4ec]">SCANNING:</span> Probing standard ports (1-1024)...</p>
                    <p className="text-on-surface"><span className="text-outline">[14:22:08]</span> <span className="text-tertiary text-[#9cff93]">DETECTED:</span> Port 80 (HTTP) - Nginx/1.18.0 (Ubuntu)</p>
                    <p className="text-on-surface"><span className="text-outline">[14:22:10]</span> <span className="text-tertiary text-[#9cff93]">DETECTED:</span> Port 443 (HTTPS) - OpenSSL/1.1.1</p>
                    <p className="text-on-surface-variant"><span className="text-outline">[14:22:12]</span> <span className="text-error-dim text-[#d7383b]">ALERT:</span> Potential XSS vulnerability identified on /api/v1/auth</p>
                    <p className="text-on-surface-variant"><span className="text-outline">[14:22:15]</span> <span className="text-primary-fixed-dim text-[#00d4ec]">SCANNING:</span> Enumerating subdomains...</p>
                    <p className="text-on-surface-variant"><span className="text-outline">[14:22:18]</span> <span className="text-primary-fixed-dim text-[#00d4ec]">INFO:</span> Subdomain found: dev.target-node-01.internal</p>
                    <p className="text-on-surface-variant"><span className="text-outline">[14:22:20]</span> <span className="text-primary-fixed-dim text-[#00d4ec]">INFO:</span> Subdomain found: staging.target-node-01.internal</p>
                    <div className="animate-pulse flex space-x-1">
                        <span className="w-1 h-4 bg-primary/40 bg-[#81ecff]/40"></span>
                        <span className="text-primary/60 text-[#81ecff]/60">Tracing route...</span>
                    </div>
                </div>
            </div>
        </div>
    )
}