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

  const handleGenerate = (targetVersion: Version = version, overrideForceWaldo: boolean = false) => {
    let newData: FeiningerData;
    if (targetVersion === 'v1') {
      newData = generateFeiningerV1(dimensions.width, dimensions.height);
    } else {
      newData = generateFeiningerV2(dimensions.width, dimensions.height, overrideForceWaldo);
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
    <main className="flex min-h-screen flex-col items-center justify-start lg:justify-between p-8 pb-32 lg:pt-8 bg-neutral-900 text-neutral-200">
      <div className="max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Feininger Generator &nbsp;
          <span className="font-bold">Prismatism</span>
        </p>

        <div className="fixed bottom-0 left-0 flex h-auto w-full flex-col items-center justify-end bg-gradient-to-t from-white via-white dark:from-black dark:via-black pb-4 lg:static lg:h-auto lg:w-auto lg:bg-none lg:pb-0 lg:flex-col lg:items-end lg:justify-center z-10">
          
          {/* Version Selector */}
          <div className="mb-4 flex bg-neutral-800 rounded-lg p-1 border border-neutral-700 pointer-events-auto z-10">
                <button
                    onClick={() => { setVersion('v1'); handleGenerate('v1'); }}
                    className={`px-3 py-1 rounded text-xs transition ${version === 'v1' ? 'bg-neutral-600 text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
                >
                    V1: Sails
                </button>
                <button
                    onClick={(e) => { setVersion('v2'); handleGenerate('v2', e.shiftKey); }}
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
               onClick={(e) => handleGenerate(version, e.shiftKey)} 
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
                {/* Canvas Texture Filter (Global Overlay) */}
                <filter id="canvas">
                  <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.2 0" />
                </filter>

                {/* Filter 1: Horizontal Strokes (Sky, Sea) */}
                <filter id="strokeH" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.005 0.05" numOctaves="3" result="noise" seed={currentData.seed}/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="distorted" />
                  <feSpecularLighting in="noise" surfaceScale="1.5" specularConstant="0.4" specularExponent="30" lightingColor="#fff" result="light">
                    <fePointLight x="-5000" y="-10000" z="20000" />
                  </feSpecularLighting>
                  <feComposite in="light" in2="distorted" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="painted" />
                  <feComposite in="painted" in2="distorted" operator="in" />
                </filter>

                {/* Filter 2: Ground Strokes (More textured/rougher) */}
                <filter id="strokeGround" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02 0.04" numOctaves="4" result="noise" seed={currentData.seed + 3}/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="distorted" />
                  <feSpecularLighting in="noise" surfaceScale="2" specularConstant="0.3" specularExponent="25" lightingColor="#fff" result="light">
                    <fePointLight x="-5000" y="-10000" z="20000" />
                  </feSpecularLighting>
                  <feComposite in="light" in2="distorted" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="painted" />
                  <feComposite in="painted" in2="distorted" operator="in" />
                </filter>

                {/* Filter 3: Vertical Strokes (Figures, Sails) */}
                <filter id="strokeV" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.05 0.005" numOctaves="3" result="noise" seed={currentData.seed + 1}/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="distorted" />
                  <feSpecularLighting in="noise" surfaceScale="1.5" specularConstant="0.4" specularExponent="30" lightingColor="#fff" result="light">
                    <fePointLight x="-5000" y="-10000" z="20000" />
                  </feSpecularLighting>
                  <feComposite in="light" in2="distorted" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="painted" />
                  <feComposite in="painted" in2="distorted" operator="in" />
                </filter>

                {/* Filter 4: Rough/Messy Strokes (Variations, Beams) */}
                <filter id="strokeRough" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.03 0.03" numOctaves="4" result="noise" seed={currentData.seed + 2}/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" result="distorted" />
                  <feSpecularLighting in="noise" surfaceScale="2" specularConstant="0.3" specularExponent="25" lightingColor="#fff" result="light">
                     <fePointLight x="-5000" y="-10000" z="20000" />
                  </feSpecularLighting>
                  <feComposite in="light" in2="distorted" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="painted" />
                  <feComposite in="painted" in2="distorted" operator="in" />
                </filter>

                {currentData.regions?.map((region) => (
                    <clipPath id={region.id} key={region.id}>
                        {region.points ? (
                            <polygon points={region.points.map(p => `${p.x},${p.y}`).join(' ')} />
                        ) : (
                            <rect x="0" y={region.y} width={currentData.width} height={region.height} />
                        )}
                    </clipPath>
                ))}
              </defs>
              
              {/* Render Shapes Independently */}
              {currentData.shapes.map((shape) => {
                  // Determine filter based on shape ID
                  let filterId = 'strokeRough'; // default
                  if (shape.id.includes('sky') || shape.id.includes('sea')) {
                      filterId = 'strokeH';
                  } else if (shape.id.includes('ground')) {
                      filterId = 'strokeGround';
                  } else if (shape.id.includes('man') || shape.id.includes('woman') || shape.id.includes('sail')) {
                      filterId = 'strokeV';
                  }
                  
                  return (
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
                        filter={`url(#${filterId})`}
                    />
                  );
              })}
              
              {/* Overlay Canvas Texture */}
              <rect width="100%" height="100%" filter="url(#canvas)" opacity="0.2" style={{ mixBlendMode: 'overlay' }} pointerEvents="none"/>
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
