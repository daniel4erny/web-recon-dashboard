import React from "react";

export default function ConsoleLogger({ info }: { info?: string[] }){
    return(
        <div className="grid grid-cols-12 gap-6">
            {/* Real-time Console Log */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-xl overflow-hidden flex flex-col h-125">
                </div>
                <div className="grow p-6 font-mono text-sm space-y-2 overflow-y-auto bg-surface-container-low/50">
                    {info?.map((log, index) => (
                        <div key={index}>{log}</div>
                    ))}
                </div>
        </div>
    )
}