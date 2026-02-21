"use client";

import { useEffect, useState } from "react";
import { generateFeiningerV1, generateFeiningerV2, generateFeiningerGemini3, FeiningerData } from "../lib/feininger";
import { FeiningerSVG } from "./components/FeiningerSVG";
import { FeiningerCanvas } from "./components/FeiningerCanvas";
import { FeiningerGemini3 } from "./components/FeiningerGemini3";
import { Ship, Users, Waves, Box, FileCode, Play, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

type Version = 'v1' | 'v2' | 'gemini3';
type RenderMode = 'svg' | 'canvas';

export default function Home() {
  const [history, setHistory] = useState<FeiningerData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [version, setVersion] = useState<Version>('v2');
  const [renderMode, setRenderMode] = useState<RenderMode>('canvas');
  const [dimensions] = useState({ width: 800, height: 600 });

  const handleGenerate = (targetVersion: Version = version, overrideForceWaldo: boolean = false) => {
    let newData: FeiningerData;
    if (targetVersion === 'v1') {
      newData = generateFeiningerV1(dimensions.width, dimensions.height);
    } else if (targetVersion === 'gemini3') {
      newData = generateFeiningerGemini3(dimensions.width, dimensions.height);
    } else {
      newData = generateFeiningerV2(dimensions.width, dimensions.height, overrideForceWaldo);
    }
    
    const newHistory = [...history.slice(0, currentIndex + 1), newData];
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  // Initial generation
  useEffect(() => {
    handleGenerate('v2');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentData = history[currentIndex];
  const showRenderToggle = version !== 'gemini3';

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-200 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <aside className="w-20 lg:w-72 border-r border-white/5 bg-neutral-900/50 backdrop-blur-xl flex flex-col p-4 gap-8">
        <div className="flex items-center gap-3 px-3 py-6 border-b border-white/5 w-full mb-2">
          <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl shadow-inner">
             <Box className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col hidden lg:flex">
            <span className="font-bold text-lg tracking-tight leading-none">Feininger</span>
            <span className="text-[10px] text-neutral-500 font-mono mt-1 uppercase tracking-widest">Prismatism Lab</span>
          </div>
        </div>

        <nav className="flex flex-col gap-3 w-full flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold px-3 mb-1 hidden lg:block opacity-50">Collection</p>
          
          <button
            onClick={() => { setVersion('v1'); handleGenerate('v1'); }}
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${version === 'v1' ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border border-transparent'}`}
            title="V1: Sails"
          >
            <Ship className={`w-5 h-5 transition-transform duration-500 ${version === 'v1' ? 'text-slate-400 scale-110' : 'group-hover:text-neutral-400'}`} />
            <div className="flex flex-col items-start leading-none hidden lg:flex">
              <span className="font-bold text-sm">V1: Sails</span>
              <span className="text-[10px] opacity-40 mt-1.5 font-mono">Generative Prismatism</span>
            </div>
          </button>

          <button
            onClick={(e) => { setVersion('v2'); handleGenerate('v2', e.shiftKey); }}
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${version === 'v2' ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border border-transparent'}`}
            title="V2: Figures"
          >
            <Users className={`w-5 h-5 transition-transform duration-500 ${version === 'v2' ? 'text-slate-400 scale-110' : 'group-hover:text-neutral-400'}`} />
            <div className="flex flex-col items-start leading-none hidden lg:flex">
              <span className="font-bold text-sm">V2: Figures</span>
              <span className="text-[10px] opacity-40 mt-1.5 font-mono">Intentional Forms</span>
            </div>
          </button>

          <div className="h-px bg-white/5 my-2 mx-3 hidden lg:block" />

          <button
            onClick={() => { setVersion('gemini3'); handleGenerate('gemini3'); }}
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${version === 'gemini3' ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border border-transparent'}`}
            title="Gemini 3.1 Pro"
          >
            <Waves className={`w-5 h-5 transition-transform duration-500 ${version === 'gemini3' ? 'text-slate-400 scale-110' : 'group-hover:text-neutral-400'}`} />
            <div className="flex flex-col items-start leading-none hidden lg:flex">
              <span className="font-bold text-sm line-clamp-1">Gemini 3.1</span>
              <span className="text-[10px] opacity-40 mt-1.5 font-mono uppercase">Reference Art</span>
            </div>
          </button>
        </nav>

        {/* Improved Toggle */}
        <div className="w-full pt-6 border-t border-white/5 mt-auto pb-4 px-1">
          {showRenderToggle && (
            <>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold px-3 mb-4 hidden lg:block opacity-50 text-center uppercase tracking-widest">Engine</p>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 relative h-9">
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
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(30,41,59,0.15),transparent)]">
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
            <div className="flex bg-black/40 rounded-xl p-1.5 border border-white/5">
               <button 
                 onClick={handlePrevious} 
                 disabled={currentIndex <= 0}
                 className="p-2.5 hover:bg-white/5 disabled:opacity-10 rounded-lg transition-all text-neutral-400 active:scale-90"
               >
                 <ChevronLeft className="w-5 h-5" />
               </button>
               <div className="px-4 flex items-center text-xs font-mono font-bold text-neutral-400 tabular-nums">
                 {currentIndex + 1} <span className="mx-2 opacity-20">/</span> {history.length}
               </div>
               <button 
                 onClick={handleNext} 
                 disabled={currentIndex >= history.length - 1}
                 className="p-2.5 hover:bg-white/5 disabled:opacity-10 rounded-lg transition-all text-neutral-400 active:scale-90"
               >
                 <ChevronRight className="w-5 h-5" />
               </button>
            </div>

            <button 
               onClick={(e) => handleGenerate(version, e.shiftKey)} 
               className="flex items-center gap-3 px-8 py-3.5 bg-white text-black hover:bg-neutral-200 rounded-2xl font-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 uppercase tracking-tighter text-sm"
            >
               <RefreshCw className="w-4 h-4" />
               Re-Imagine
            </button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-12">
          <div className="relative group">
            {/* Frame shadow/glow */}
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

        {/* Footer info bars */}
        <footer className="p-8 border-t border-neutral-900 flex justify-center gap-12 text-neutral-500">
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
      </main>
    </div>
  );
}