"use client";

import { useEffect, useState } from "react";
import { generateFeiningerV1, generateFeiningerV2, generateFeiningerV3, generateFeiningerGemini3, FeiningerData } from "../../lib/feininger";
import { FeiningerSVG } from "../components/FeiningerSVG";
import { FeiningerCanvas } from "../components/FeiningerCanvas";
import { FeiningerGemini3 } from "../components/FeiningerGemini3";
import { FeiningerGemini3Canvas } from "../components/FeiningerGemini3Canvas";
import { FeiningerV3 } from "../components/FeiningerV3";
import { FeiningerV3Canvas } from "../components/FeiningerV3Canvas";
import { useHistory } from "../context/HistoryContext";
import { RefreshCw, Box, FileCode, Play } from "lucide-react";

type Version = 'prismatic-sails' | 'the-watchers' | 'calm-day-n-plus-1' | 'calm-day-at-sea-iii';
type RenderMode = 'svg' | 'canvas';

// Helper to generate new data
const getNewData = (version: Version, dimensions: {width: number, height: number}, override: boolean): FeiningerData => {
  switch (version) {
    case 'prismatic-sails':
      return generateFeiningerV1(dimensions.width, dimensions.height);
    case 'calm-day-at-sea-iii':
      return generateFeiningerGemini3(dimensions.width, dimensions.height);
    case 'calm-day-n-plus-1':
      return generateFeiningerV3(dimensions.width, dimensions.height);
    case 'the-watchers':
    default:
      return generateFeiningerV2(dimensions.width, dimensions.height, override);
  }
}

export default function VersionClient({ version }: { version: Version }) {
  const [dimensions] = useState({ width: 800, height: 600 });
  const [currentData, setCurrentData] = useState<FeiningerData | null>(null);
  const { addToHistory } = useHistory();
  const [renderMode, setRenderMode] = useState<RenderMode>(() => version === 'calm-day-at-sea-iii' ? 'svg' : 'canvas');

  const handleGenerate = (overrideForceWaldo: boolean = false) => {
    const newData = getNewData(version, dimensions, overrideForceWaldo);
    setCurrentData(newData);
    addToHistory(newData);
  };

  useEffect(() => {
    handleGenerate();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const showRenderToggle = true;

  return (
    <div className="flex-1 h-screen flex flex-col relative overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(30,41,59,0.15),transparent)]">
      <header className="flex items-center justify-between px-10 py-10 bg-transparent sticky top-0 z-20">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic drop-shadow-2xl">
            {currentData?.version === 'prismatic-sails' ? 'Prismatic Sails' : currentData?.version === 'the-watchers' ? 'The Watchers' : currentData?.version === 'calm-day-n-plus-1' ? 'Calm Day at Sea N+1' : 'Calm Day at Sea III'}
          </h1>
          <div className="flex items-center gap-3 mt-2">
             <span className="px-2 py-0.5 bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-400 rounded uppercase tracking-tighter shadow-xl">
                Edition {currentData?.seed || '000'}
             </span>
             <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest opacity-40">
                {currentData?.version || 'N/A'}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {showRenderToggle && (
            <div className="flex bg-white/5 backdrop-blur-xl p-1 rounded-full border border-white/10 relative h-10 w-44 shadow-2xl">
               <div 
                 className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-br from-slate-500 to-slate-700 rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_15px_rgba(255,255,255,0.1)] ${renderMode === 'canvas' ? 'translate-x-full' : 'translate-x-0'}`}
               />
               <button 
                 onClick={() => setRenderMode('svg')}
                 className={`flex-1 flex items-center justify-center text-[10px] font-black z-10 transition-all duration-300 tracking-[0.2em] ${renderMode === 'svg' ? 'text-white' : 'text-neutral-500 hover:text-neutral-400'}`}
               >
                 SVG
               </button>
               <button 
                 onClick={() => setRenderMode('canvas')}
                 className={`flex-1 flex items-center justify-center text-[10px] font-black z-10 transition-all duration-300 tracking-[0.2em] ${renderMode === 'canvas' ? 'text-white' : 'text-neutral-500 hover:text-neutral-400'}`}
               >
                 CANVAS
               </button>
            </div>
          )}

          <button 
             onClick={(e) => handleGenerate(e.shiftKey)} 
             className="flex items-center gap-3 px-10 py-4 bg-white text-black hover:bg-neutral-200 rounded-full font-black transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95 uppercase tracking-tighter text-sm group"
          >
             <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
             Re-Imagine
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-12">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-slate-800 to-neutral-800 rounded-lg blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative border-[1px] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-white overflow-hidden rounded-sm ring-1 ring-white/5">
            {currentData ? (
              <>
                {currentData.version === 'calm-day-at-sea-iii' ? (
                  renderMode === 'svg' ? <FeiningerGemini3 /> : <FeiningerGemini3Canvas />
                ) : currentData.version === 'calm-day-n-plus-1' ? (
                  renderMode === 'svg' ? <FeiningerV3 data={currentData} /> : <FeiningerV3Canvas data={currentData} />
                ) : renderMode === 'svg' ? (
                   <FeiningerSVG data={currentData} />
                ) : (
                   <FeiningerCanvas data={currentData} />
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-[600px] w-[800px] bg-neutral-900 text-neutral-700 animate-pulse">
                <Box className="w-12 h-12" />
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="p-12 flex justify-center gap-16 text-neutral-500 bg-transparent">
         <div className="flex flex-col items-center">
           <span className="text-[10px] uppercase tracking-[0.3em] mb-2 opacity-30 font-bold text-white">Architecture</span>
           <span className="text-xs font-black text-neutral-400 uppercase tracking-tighter">{currentData?.version === 'calm-day-at-sea-iii' ? 'Calm Day at Sea III' : currentData?.version === 'calm-day-n-plus-1' ? 'Calm Day at Sea N+1' : currentData?.version === 'prismatic-sails' ? 'Prismatic Sails' : currentData?.version === 'the-watchers' ? 'The Watchers' : (currentData?.version || '-')}</span>
         </div>
         <div className="flex flex-col items-center">
           <span className="text-[10px] uppercase tracking-[0.3em] mb-2 opacity-30 font-bold text-white">Renderer</span>
           <span className="text-xs font-black text-neutral-400 uppercase tracking-tighter">
             {renderMode.toUpperCase()}
           </span>
         </div>
         <div className="flex flex-col items-center">
           <span className="text-[10px] uppercase tracking-[0.3em] mb-2 opacity-30 font-bold text-white">Resolution</span>
           <span className="text-xs font-black text-neutral-400 uppercase tracking-tighter">800 &times; 1200</span>
         </div>
      </footer>
    </div>
  );
}
