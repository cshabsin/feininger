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
    <div className="flex h-screen bg-neutral-950 text-neutral-200 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col items-center lg:items-stretch p-4 gap-8">
        <div className="flex items-center gap-3 px-2 py-4 border-b border-neutral-800 w-full mb-4">
          <div className="p-2 bg-slate-700 rounded-lg">
             <Box className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-lg hidden lg:block tracking-tight">Feininger</span>
        </div>

        <nav className="flex flex-col gap-2 w-full flex-1">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold px-3 mb-2 hidden lg:block">Versions</p>
          
          <button
            onClick={() => { setVersion('v1'); handleGenerate('v1'); }}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${version === 'v1' ? 'bg-slate-800 text-white shadow-lg border border-slate-700' : 'text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'}`}
            title="V1: Sails"
          >
            <Ship className={`w-5 h-5 ${version === 'v1' ? 'text-slate-400' : 'group-hover:text-neutral-400'}`} />
            <div className="flex flex-col items-start leading-none hidden lg:flex">
              <span className="font-semibold text-sm">V1: Sails</span>
              <span className="text-[10px] opacity-50 mt-1">Prismatism</span>
            </div>
          </button>

          <button
            onClick={(e) => { setVersion('v2'); handleGenerate('v2', e.shiftKey); }}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${version === 'v2' ? 'bg-slate-800 text-white shadow-lg border border-slate-700' : 'text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'}`}
            title="V2: Figures"
          >
            <Users className={`w-5 h-5 ${version === 'v2' ? 'text-slate-400' : 'group-hover:text-neutral-400'}`} />
            <div className="flex flex-col items-start leading-none hidden lg:flex">
              <span className="font-semibold text-sm">V2: Figures</span>
              <span className="text-[10px] opacity-50 mt-1">Intentional</span>
            </div>
          </button>

          <button
            onClick={() => { setVersion('gemini3'); handleGenerate('gemini3'); }}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${version === 'gemini3' ? 'bg-slate-800 text-white shadow-lg border border-slate-700' : 'text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'}`}
            title="Gemini 3.1 Pro"
          >
            <Waves className={`w-5 h-5 ${version === 'gemini3' ? 'text-slate-400' : 'group-hover:text-neutral-400'}`} />
            <div className="flex flex-col items-start leading-none hidden lg:flex">
              <span className="font-semibold text-sm line-clamp-1">Gemini 3.1</span>
              <span className="text-[10px] opacity-50 mt-1 uppercase">Reference</span>
            </div>
          </button>
        </nav>

        {/* Conditional Toggle */}
        {showRenderToggle && (
          <div className="w-full pt-6 border-t border-neutral-800 mt-auto">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold px-3 mb-4 hidden lg:block">Renderer</p>
            <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 relative">
               <div 
                 className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-700 rounded-lg transition-transform duration-200 ease-out ${renderMode === 'canvas' ? 'translate-x-full' : 'translate-x-0'}`}
               />
               <button 
                 onClick={() => setRenderMode('svg')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold z-10 transition-colors ${renderMode === 'svg' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
               >
                 <FileCode className="w-3.5 h-3.5" />
                 <span className="hidden lg:block">SVG</span>
               </button>
               <button 
                 onClick={() => setRenderMode('canvas')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold z-10 transition-colors ${renderMode === 'canvas' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
               >
                 <Play className="w-3.5 h-3.5" />
                 <span className="hidden lg:block">Canvas</span>
               </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        <header className="flex items-center justify-between p-6 border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Prismatism</h1>
            <p className="text-xs text-neutral-500 font-mono">
              {currentData?.version === 'v1' ? 'LYONEL FEININGER STYLE - V1' : currentData?.version === 'v2' ? 'LYONEL FEININGER STYLE - V2' : 'GEMINI 3.1 REFERENCE'}
            </p>
          </div>

          <div className="flex gap-2">
            <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800 mr-4">
               <button 
                 onClick={handlePrevious} 
                 disabled={currentIndex <= 0}
                 className="p-2 hover:bg-neutral-800 disabled:opacity-20 rounded-md transition text-neutral-400"
               >
                 <ChevronLeft className="w-5 h-5" />
               </button>
               <div className="px-3 flex items-center text-xs font-mono text-neutral-500 tabular-nums">
                 {currentIndex + 1} / {history.length}
               </div>
               <button 
                 onClick={handleNext} 
                 disabled={currentIndex >= history.length - 1}
                 className="p-2 hover:bg-neutral-800 disabled:opacity-20 rounded-md transition text-neutral-400"
               >
                 <ChevronRight className="w-5 h-5" />
               </button>
            </div>

            <button 
               onClick={(e) => handleGenerate(version, e.shiftKey)} 
               className="flex items-center gap-2 px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition text-white shadow-lg shadow-slate-900/50 border border-slate-600 active:scale-95"
            >
               <RefreshCw className="w-4 h-4" />
               Generate
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