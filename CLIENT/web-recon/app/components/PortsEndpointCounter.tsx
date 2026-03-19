export default function PortsEndpointCounter() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-surface-bright p-4 rounded-lg bg-[#2c2c2c]">
        <span className="block text-primary font-headline text-2xl font-bold text-[#81ecff]">14</span>
        <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter text-[#adaaaa]">Open Ports</span>
      </div>
      <div className="bg-surface-bright p-4 rounded-lg bg-[#2c2c2c]">
        <span className="block text-tertiary font-headline text-2xl font-bold text-[#9cff93]">892</span>
        <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter text-[#adaaaa]">Endpoints</span>
      </div>
    </div>
  );
}