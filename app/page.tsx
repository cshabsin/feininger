"use client";

import { useEffect, useState } from "react";
import { generateFeiningerV1, generateFeiningerV2, FeiningerData } from "../lib/feininger";

type Version = 'v1' | 'v2';

export default function Home() {
  const [history, setHistory] = useState<FeiningerData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [version, setVersion] = useState<Version>('v2');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Initial generation
  useEffect(() => {
    handleGenerate('v2'); 
  }, []);

  const handleGenerate = (targetVersion: Version = version) => {
    let newData: FeiningerData;
    if (targetVersion === 'v1') {
      newData = generateFeiningerV1(dimensions.width, dimensions.height);
    } else {
      newData = generateFeiningerV2(dimensions.width, dimensions.height);
    }
    
    const newHistory = [...history.slice(0, currentIndex + 1), newData];
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-neutral-900 text-neutral-200">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Feininger Generator &nbsp;
          <span className="font-bold">Prismatism</span>
        </p>

        <div className="fixed bottom-0 left-0 flex h-auto w-full flex-col items-center justify-end bg-gradient-to-t from-white via-white dark:from-black dark:via-black pb-4 lg:static lg:h-auto lg:w-auto lg:bg-none lg:pb-0 lg:flex-col lg:items-end lg:justify-center">
          
          {/* Version Selector */}
          <div className="mb-4 flex bg-neutral-800 rounded-lg p-1 border border-neutral-700 pointer-events-auto">
                <button
                    onClick={() => { setVersion('v1'); handleGenerate('v1'); }}
                    className={`px-3 py-1 rounded text-xs transition ${version === 'v1' ? 'bg-neutral-600 text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
                >
                    V1: Sails
                </button>
                <button
                    onClick={() => { setVersion('v2'); handleGenerate('v2'); }}
                    className={`px-3 py-1 rounded text-xs transition ${version === 'v2' ? 'bg-neutral-600 text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
                >
                    V2: Figures
                </button>
            </div>

          <div className="flex gap-4 pointer-events-auto">
             <button 
               onClick={handlePrevious} 
               disabled={currentIndex <= 0}
               className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 rounded border border-neutral-700 transition"
             >
               Previous
             </button>
             <button 
               onClick={() => handleGenerate()} 
               className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded border border-slate-500 font-bold transition text-white"
             >
               Generate New
             </button>
             <button 
               onClick={handleNext} 
               disabled={currentIndex >= history.length - 1}
               className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 rounded border border-neutral-700 transition"
             >
               Next
             </button>
          </div>
        </div>
      </div>

      <div className="relative flex place-items-center justify-center p-4">
        {currentData ? (
          <div className="border-8 border-neutral-800 shadow-2xl bg-white">
            <svg 
              width={currentData.width} 
              height={currentData.height} 
              viewBox={`0 0 ${currentData.width} ${currentData.height}`}
              className="max-w-full h-auto max-h-[70vh]"
              style={{ backgroundColor: currentData.version === 'v2' ? '#F5F5F5' : '#F0F8FF' }} 
            >
              <defs>
                <filter id="noise" x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence baseFrequency="0.6" numOctaves="3" type="fractalNoise" result="turbulence"/>
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" in="turbulence" result="coloredNoise"/>
                    <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite"/>
                </filter>
                
                {currentData.regions?.map((region) => (
                    <clipPath id={region.id} key={region.id}>
                        <rect x="0" y={region.y} width={currentData.width} height={region.height} />
                    </clipPath>
                ))}
              </defs>
              
              {/* Render Shapes */}
              {currentData.shapes.map((shape) => (
                <polygon
                  key={shape.id}
                  points={shape.points.map(p => `${p.x},${p.y}`).join(' ')}
                  fill={shape.fill}
                  fillOpacity={shape.opacity}
                  stroke={shape.fill} 
                  strokeWidth="0.5"
                  strokeOpacity={shape.opacity * 1.5}
                  style={{ mixBlendMode: shape.blendMode || 'multiply' }} 
                  clipPath={shape.clipPathId ? `url(#${shape.clipPathId})` : undefined}
                />
              ))}
              
              {/* Optional: Overlay texture for paper feel */}
              <rect width="100%" height="100%" filter="url(#noise)" opacity="0.3" fill="none"/>
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[600px] w-[800px] border border-dashed border-neutral-700 text-neutral-500">
            Generating...
          </div>
        )}
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
         <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Mode{' '}
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            {currentData ? (currentData.version === 'v1' ? 'Sails / Prismatism' : 'Figures / Intentional') : '-'}
          </p>
        </div>
      </div>
    </main>
  );
}
