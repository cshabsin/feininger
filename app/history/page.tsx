"use client";

import { useHistory } from "../context/HistoryContext";
import { FeiningerSVG } from "../components/FeiningerSVG";
import { FeiningerGemini3 } from "../components/FeiningerGemini3";
import { FeiningerV3 } from "../components/FeiningerV3";
import { Image } from "lucide-react";

export default function HistoryPage() {
  const { history } = useHistory();

  return (
    <div className="flex-1 h-screen flex flex-col relative overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(30,41,59,0.15),transparent)]">
      <header className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-neutral-950/20 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Image className="w-8 h-8 text-neutral-500" />
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Generation History
            </h1>
            <p className="text-sm text-neutral-500">{history.length} items recorded</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-10">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-600">
            <Image className="w-24 h-24 mb-4" />
            <h2 className="text-2xl font-bold text-neutral-400 uppercase tracking-tighter italic">No History Yet</h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest opacity-50">Generated images will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {history.map((item, index) => (
              <div key={`${item.version}-${item.seed}-${index}`} className="border border-white/5 rounded-2xl p-4 bg-black/40 backdrop-blur-sm flex flex-col gap-4 group hover:border-white/10 transition-all duration-500 hover:shadow-2xl">
                <div className="overflow-hidden rounded-xl border border-white/5 shadow-inner bg-white ring-1 ring-white/5">
                   {item.version === 'gemini3' ? (
                      <FeiningerGemini3 />
                    ) : item.version === 'v3' ? (
                      <FeiningerV3 data={item} />
                    ) : (
                      <FeiningerSVG data={item} />
                    )
                   }
                </div>
                <div className="flex justify-between items-center px-1">
                   <div className="flex flex-col">
                     <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter mb-0.5">
                       {item.version === 'gemini3' ? 'Calm Day at Sea III' : item.version === 'v3' ? 'Calm Day at Sea N+1' : item.version}
                     </span>
                     <span className="text-xs font-bold text-neutral-300 uppercase tracking-tight">
                       Edition {item.seed}
                     </span>
                   </div>
                   <span className="text-[10px] font-mono text-neutral-600 group-hover:text-neutral-400 transition uppercase">
                      #{index + 1}
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
