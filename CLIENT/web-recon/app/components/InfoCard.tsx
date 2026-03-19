export default function InfoCard() {
  return (
    <div className="bg-[#00E5FF]/5 rounded-xl p-6 border border-[#00E5FF]/10 relative overflow-hidden flex-grow">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-6xl">radar</span>
      </div>
      <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-4">Target Identity</h3>
      <div className="space-y-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-on-surface-variant uppercase text-[#adaaaa]">Organization</span>
          <span className="text-sm font-medium">Kinetic Defense Systems</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-on-surface-variant uppercase text-[#adaaaa]">Infrastructure</span>
          <span className="text-sm font-medium">AWS US-EAST-1 (North Virginia)</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-on-surface-variant uppercase text-[#adaaaa]">IP Architecture</span>
          <span className="text-sm font-mono text-primary text-[#81ecff]">172.67.142.102</span>
        </div>
      </div>
      <button className="mt-6 w-full py-3 border border-primary/30 text-primary text-[#81ecff] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-[#81ecff]/10 transition-colors">
        View Detailed Topology
      </button>
    </div>
  );
}