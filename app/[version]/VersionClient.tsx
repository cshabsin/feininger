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
  const [isRendering, setIsRendering] = useState(false);

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

  const handleRenderModeChange = (mode: RenderMode) => {
    if (mode === renderMode) return;
    setIsRendering(true);
    // Defer the actual mode switch to allow the loading UI to paint
    setTimeout(() => {
      setRenderMode(mode);
      // Keep overlay for a minimum duration to avoid flicker
      setTimeout(() => setIsRendering(false), 300);
    }, 50);
  };

  return (
    <div className="flex-1 h-screen flex flex-col relative overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(30,41,59,0.15),transparent)]">
      <header className="flex items-center justify-between px-10 py-10 bg-transparent sticky top-0 z-20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-2xl">
            {currentData?.version === 'prismatic-sails' ? 'Prismatic Sails' : currentData?.version === 'the-watchers' ? 'The Watchers' : currentData?.version === 'calm-day-n-plus-1' ? 'Calm Day at Sea N+1' : 'Calm Day at Sea III'}
          </h1>
          <div className="flex items-center gap-3 mt-2">
             <span className="text-[10px] text-neutral-500 font-mono opacity-40 uppercase">
                {currentData?.version || 'N/A'}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-12">
          {showRenderToggle && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] font-mono uppercase opacity-20 tracking-[0.3em]">Renderer</span>
              <div className="flex bg-black/60 backdrop-blur-3xl p-1 rounded-xl border border-white/10 relative h-11 w-48 shadow-2xl ring-1 ring-white/5">
                <div 
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_25px_rgba(255,255,255,0.3)] ${renderMode === 'canvas' ? 'translate-x-full' : 'translate-x-0'}`}
                />
                <button 
                  onClick={() => handleRenderModeChange('svg')}
                  className={`flex-1 flex items-center justify-center gap-2 z-10 transition-all duration-500 ${renderMode === 'svg' ? 'text-black font-black' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  <FileCode className={`w-3.5 h-3.5 ${renderMode === 'svg' ? 'opacity-100' : 'opacity-40'}`} />
                  <span className="text-[10px] tracking-widest uppercase">SVG</span>
                </button>
                <button 
                  onClick={() => handleRenderModeChange('canvas')}
                  className={`flex-1 flex items-center justify-center gap-2 z-10 transition-all duration-500 ${renderMode === 'canvas' ? 'text-black font-black' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  <Play className={`w-3.5 h-3.5 ${renderMode === 'canvas' ? 'opacity-100' : 'opacity-40'}`} />
                  <span className="text-[10px] tracking-widest uppercase">Canvas</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-mono uppercase opacity-20 tracking-[0.3em]">Actions</span>
            <button 
               onClick={(e) => handleGenerate(e.shiftKey)} 
               className="flex items-center gap-3 h-11 px-8 bg-white/10 backdrop-blur-3xl border border-white/10 rounded-xl font-bold transition-all hover:bg-white/20 active:scale-[0.98] group shadow-2xl ring-1 ring-white/5"
            >
               <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-700 text-neutral-400" />
               <span className="text-[10px] tracking-widest uppercase text-white">Re-Imagine</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex flex-col items-center w-full">
          <div className={`relative group w-full ${currentData?.width === 800 && currentData?.height === 1200 ? 'max-w-[400px]' : 'max-w-[800px]'}`}>
            <div className="absolute -inset-2 bg-gradient-to-r from-slate-800 to-neutral-800 rounded-lg blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative border-[1px] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-neutral-900 overflow-hidden rounded-sm ring-1 ring-white/5 w-full">
              {/* Rendering Overlay */}
              {isRendering && (
                <div className="absolute inset-0 z-40 bg-neutral-950/40 backdrop-blur-md flex flex-col items-center justify-center transition-opacity duration-300">
                  <RefreshCw className="w-8 h-8 text-white animate-spin mb-4 opacity-80" />
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.3em]">Rendering</span>
                </div>
              )}

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

          <div className="mt-12 max-w-2xl text-center">
            <p className="text-neutral-400 text-sm leading-relaxed font-light tracking-wide">
              {currentData?.version === 'prismatic-sails' && "An early generative exploration based roughly on 'Calm Day at Sea II', created with loose prompting to Gemini 2.5."}
              {currentData?.version === 'the-watchers' && "Another early experimental piece inspired by 'Calm Day at Sea II', developed through iterative prompting with Gemini 2.5."}
              {currentData?.version === 'calm-day-at-sea-iii' && "A master reference resulting from a specific request to Gemini 3.1 Pro to interpret and animate 'Calm Day at Sea III' as a hand-crafted SVG."}
              {currentData?.version === 'calm-day-n-plus-1' && "A programmatic attempt to generate new scenarios based on the 'Calm Day at Sea III' reference, with code assistance from Gemini 3.1 Pro."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
