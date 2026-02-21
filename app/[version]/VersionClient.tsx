"use client";

import { useEffect, useState } from "react";
import { generateFeiningerV1, generateFeiningerV2, generateFeiningerGemini3, FeiningerData } from "../../lib/feininger";
import { FeiningerSVG } from "../components/FeiningerSVG";
import { FeiningerCanvas } from "../components/FeiningerCanvas";
import { FeiningerGemini3 } from "../components/FeiningerGemini3";
import { useHistory } from "../context/HistoryContext";
import { RefreshCw, Box, FileCode, Play } from "lucide-react";

type Version = 'v1' | 'v2' | 'gemini3';
type RenderMode = 'svg' | 'canvas';

// Helper to generate new data
const getNewData = (version: Version, dimensions: {width: number, height: number}, override: boolean): FeiningerData => {
  switch (version) {
    case 'v1':
      return generateFeiningerV1(dimensions.width, dimensions.height);
    case 'gemini3':
      return generateFeiningerGemini3(dimensions.width, dimensions.height);
    case 'v2':
    default:
      return generateFeiningerV2(dimensions.width, dimensions.height, override);
  }
}

export default function VersionClient({ version }: { version: Version }) {
  const [dimensions] = useState({ width: 800, height: 600 });
  const [currentData, setCurrentData] = useState<FeiningerData | null>(null);
  const { addToHistory } = useHistory();
  const [renderMode, setRenderMode] = useState<RenderMode>(() => version === 'gemini3' ? 'svg' : 'canvas');

  const handleGenerate = (overrideForceWaldo: boolean = false) => {
    const newData = getNewData(version, dimensions, overrideForceWaldo);
    setCurrentData(newData);
    addToHistory(newData);
  };

  useEffect(() => {
    handleGenerate();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const showRenderToggle = version !== 'gemini3';

  return (
    <div className="flex-1 h-screen flex flex-col relative overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(30,41,59,0.15),transparent)]">
      <header className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-neutral-950/20 backdrop-blur-md sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
            {currentData?.version === 'v1' ? 'Prismatic Sails' : currentData?.version === 'v2' ? 'The Watchers' : 'Gemini Reference'}
          </h1>
          <div className="flex items-center gap-3 mt-1.5">
             <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400 rounded uppercase tracking-tighter">
                Edition {currentData?.seed || '000'}
             </span>
             <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest opacity-60">
                {currentData?.version || 'N/A'}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {showRenderToggle && (
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 relative h-9 w-40">
               <div 
                 className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-700/80 rounded-lg transition-all duration-300 shadow-lg ${renderMode === 'canvas' ? 'translate-x-full' : 'translate-x-0'}`}
               />
               <button 
                 onClick={() => setRenderMode('svg')}
                 className={`flex-1 flex items-center justify-center text-[10px] font-bold z-10 transition-colors tracking-widest ${renderMode === 'svg' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
               >
                 SVG
               </button>
               <button 
                 onClick={() => setRenderMode('canvas')}
                 className={`flex-1 flex items-center justify-center text-[10px] font-bold z-10 transition-colors tracking-widest ${renderMode === 'canvas' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
               >
                 CANVAS
               </button>
            </div>
          )}

          <button 
             onClick={(e) => handleGenerate(e.shiftKey)} 
             className="flex items-center gap-3 px-8 py-3.5 bg-white text-black hover:bg-neutral-200 rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 uppercase tracking-tighter text-sm"
          >
             <RefreshCw className="w-4 h-4" />
             Re-Imagine
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-12">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-800 to-neutral-800 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative border-[12px] border-neutral-900 shadow-2xl bg-white overflow-hidden rounded-sm ring-1 ring-neutral-800">
            {currentData ? (
              <>
                {currentData.version === 'gemini3' ? (
                  <FeiningerGemini3 />
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

      <footer className="p-8 border-t border-white/5 flex justify-center gap-12 text-neutral-500">
         <div className="flex flex-col items-center">
           <span className="text-[10px] uppercase tracking-tighter mb-1">Architecture</span>
           <span className="text-sm font-semibold text-neutral-300 uppercase">{currentData?.version || '-'}</span>
         </div>
         <div className="flex flex-col items-center">
           <span className="text-[10px] uppercase tracking-tighter mb-1">Renderer</span>
           <span className="text-sm font-semibold text-neutral-300">
             {currentData?.version === 'gemini3' ? 'SVG' : renderMode.toUpperCase()}
           </span>
         </div>
         <div className="flex flex-col items-center">
           <span className="text-[10px] uppercase tracking-tighter mb-1">Resolution</span>
           <span className="text-sm font-semibold text-neutral-300">800 &times; 600</span>
         </div>
      </footer>
    </div>
  );
}
