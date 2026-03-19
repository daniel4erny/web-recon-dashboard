export default function ScanProgressBars() {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-on-surface-variant text-[#adaaaa]">Critical Threats</span>
        <span className="text-error font-mono font-bold text-[#ff716c]">02</span>
      </div>
      <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden bg-[#000000]">
        <div className="bg-error w-[15%] h-full bg-[#ff716c]"></div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-on-surface-variant text-[#adaaaa]">Surface Exposure</span>
        <span className="text-primary font-mono font-bold text-[#81ecff]">42%</span>
      </div>
      <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden bg-[#000000]">
        <div className="bg-primary w-[42%] h-full bg-[#81ecff]"></div>
      </div>
    </div>
  );
}