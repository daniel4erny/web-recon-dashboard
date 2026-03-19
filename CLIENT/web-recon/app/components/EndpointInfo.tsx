export default function EndpointInfo() {
  return (
    <div className="flex-grow p-6 font-mono text-sm space-y-2 overflow-y-auto bg-surface-container-low/50 text-on-surface-variant h-full min-h-[300px]">
      <div className="border-b border-outline-variant/10 pb-4 mb-4">
        <h4 className="font-headline text-tertiary mb-2 tracking-widest text-xs uppercase text-[#9cff93]">Discovered Endpoints</h4>
        <div className="grid grid-cols-4 gap-4 text-xs font-bold text-outline uppercase tracking-wider mb-2 text-[#767575]">
          <span>Method</span>
          <span className="col-span-2">Path</span>
          <span>Status</span>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-4 text-sm items-center hover:bg-surface-bright/30 p-2 rounded transition-colors hover:bg-[#2c2c2c]/30">
            <span className="text-secondary-fixed-dim text-[#acc3ff]">GET</span>
            <span className="col-span-2 text-on-surface text-white">/api/v1/health</span>
            <span className="text-tertiary text-[#9cff93]">200 OK</span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm items-center hover:bg-surface-bright/30 p-2 rounded transition-colors hover:bg-[#2c2c2c]/30">
            <span className="text-tertiary text-[#9cff93]">POST</span>
            <span className="col-span-2 text-on-surface text-white">/api/v1/auth/login</span>
            <span className="text-tertiary text-[#9cff93]">200 OK</span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm items-center hover:bg-surface-bright/30 p-2 rounded transition-colors hover:bg-[#2c2c2c]/30">
            <span className="text-secondary-fixed-dim text-[#acc3ff]">GET</span>
            <span className="col-span-2 text-on-surface text-white">/admin/dashboard</span>
            <span className="text-error-dim text-[#d7383b]">401 UNAUTHORIZED</span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm items-center hover:bg-surface-bright/30 p-2 rounded transition-colors hover:bg-[#2c2c2c]/30">
            <span className="text-error-dim text-[#d7383b]">DELETE</span>
            <span className="col-span-2 text-on-surface text-white">/api/v1/users/:id</span>
            <span className="text-error-dim text-[#d7383b]">403 FORBIDDEN</span>
          </div>
        </div>
      </div>
    </div>
  );
}