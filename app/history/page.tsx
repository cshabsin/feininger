"use client";

import { useHistory } from "../context/HistoryContext";
import { FeiningerCanvas } from "../components/FeiningerCanvas";
import { FeiningerSVG } from "../components/FeiningerSVG";
import { FeiningerGemini3 } from "../components/FeiningerGemini3";
import Link from 'next/link';
import { Home, Image } from "lucide-react";

export default function HistoryPage() {
  const { history } = useHistory();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-200 font-sans">
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
        <Link href="/v2" className="flex items-center gap-3 px-6 py-3 bg-white text-black hover:bg-neutral-200 rounded-2xl font-black transition-all active:scale-95 uppercase tracking-tighter text-sm">
          <Home className="w-4 h-4" />
          Back to Lab
        </Link>
      </header>

      <main className="flex-1 p-10">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-600">
            <Image className="w-24 h-24 mb-4" />
            <h2 className="text-2xl font-bold">No History Yet</h2>
            <p className="mt-2">Generated images will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {history.map((item, index) => (
              <div key={`${item.version}-${item.seed}-${index}`} className="border border-white/10 rounded-xl p-4 bg-neutral-900/50 flex flex-col gap-4 group">
                <div className="overflow-hidden rounded-lg border border-white/5 shadow-2xl">
                   {item.version === 'gemini3' ? (
                      <FeiningerGemini3 />
                    ) : (
                      // For history, let's default to SVG for scalability and consistency
                      <FeiningerSVG data={item} />
                    )
                   }
                </div>
                <div className="flex justify-between items-center">
                   <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 rounded uppercase tracking-tighter">
                     {item.version} - {item.seed}
                   </span>
                   <span className="text-xs text-neutral-500 group-hover:text-neutral-300 transition">
                      Item #{index + 1}
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
