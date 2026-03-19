export default function PortInfo() {
  return (
    <div className="flex-grow p-6 font-mono text-sm space-y-2 overflow-y-auto bg-surface-container-low/50 text-on-surface-variant h-full min-h-[300px]">
      <div className="border-b border-outline-variant/10 pb-4 mb-4">
        <h4 className="font-headline text-primary mb-2 tracking-widest text-xs uppercase text-[#81ecff]">Discovered Ports</h4>
        <div className="grid grid-cols-4 gap-4 text-xs font-bold text-outline uppercase tracking-wider mb-2 text-[#767575]">
          <span>Port</span>
          <span>State</span>
          <span>Service</span>
          <span>Version</span>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-4 text-sm items-center hover:bg-surface-bright/30 p-2 rounded transition-colors hover:bg-[#2c2c2c]/30">
            <span className="text-primary font-bold text-[#81ecff]">80/tcp</span>
            <span className="text-tertiary text-[#9cff93]">open</span>
            <span className="text-[#adaaaa]">http</span>
            <span className="text-outline text-[#767575]">Nginx 1.18.0</span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm items-center hover:bg-surface-bright/30 p-2 rounded transition-colors hover:bg-[#2c2c2c]/30">
            <span className="text-primary font-bold text-[#81ecff]">443/tcp</span>
            <span className="text-tertiary text-[#9cff93]">open</span>
            <span className="text-[#adaaaa]">https</span>
            <span className="text-outline text-[#767575]">OpenSSL/1.1.1</span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm items-center hover:bg-surface-bright/30 p-2 rounded transition-colors hover:bg-[#2c2c2c]/30">
            <span className="text-primary font-bold text-[#81ecff]">22/tcp</span>
            <span className="text-tertiary text-[#9cff93]">open</span>
            <span className="text-[#adaaaa]">ssh</span>
            <span className="text-outline text-[#767575]">OpenSSH 8.2p1</span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm items-center hover:bg-surface-bright/30 p-2 rounded transition-colors hover:bg-[#2c2c2c]/30">
            <span className="text-primary font-bold text-[#81ecff]">3306/tcp</span>
            <span className="text-error-dim text-[#d7383b]">filtered</span>
            <span className="text-[#adaaaa]">mysql</span>
            <span className="text-outline text-[#767575]">-</span>
          </div>
        </div>
      </div>
    </div>
  );
}