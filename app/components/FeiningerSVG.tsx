import React from 'react';
import { FeiningerData } from '@/lib/feininger';

interface FeiningerSVGProps {
  data: FeiningerData;
}

export const FeiningerSVG: React.FC<FeiningerSVGProps> = ({ data }) => {
  return (
    <svg
      width={data.width}
      height={data.height}
      viewBox={`0 0 ${data.width} ${data.height}`}
      className="max-w-full h-auto max-h-[70vh]"
      style={{ backgroundColor: data.version === 'v2' ? '#F5F5F5' : '#F0F8FF' }}
    >
      <defs>
        {/* Canvas Texture Filter (Global Overlay) */}
        <filter id="canvas">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.2 0" />
        </filter>

        {/* Filter 1: Horizontal Strokes (Sky, Sea) */}
        <filter id="strokeH" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.05" numOctaves="3" result="noise" seed={data.seed}/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="distorted" />
          <feSpecularLighting in="noise" surfaceScale="1.5" specularConstant="0.4" specularExponent="30" lightingColor="#fff" result="light">
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="light" in2="distorted" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="painted" />
          <feComposite in="painted" in2="distorted" operator="in" result="comp" />
          {/* Subtle blur for Sky/Sea, slightly less than ground */}
          <feGaussianBlur in="comp" stdDeviation="0.8" /> 
        </filter>

        {/* Filter 2: Ground Strokes (More textured/rougher) */}
        <filter id="strokeGround" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.04" numOctaves="4" result="noise" seed={data.seed + 3}/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="distorted" />
          <feSpecularLighting in="noise" surfaceScale="2" specularConstant="0.3" specularExponent="25" lightingColor="#fff" result="light">
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="light" in2="distorted" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="painted" />
          <feComposite in="painted" in2="distorted" operator="in" result="comp" />
          <feGaussianBlur in="comp" stdDeviation="1.2" />
        </filter>

        {/* Filter 3: Vertical Strokes (Figures, Sails) */}
        <filter id="strokeV" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.005" numOctaves="3" result="noise" seed={data.seed + 1}/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="distorted" />
          <feSpecularLighting in="noise" surfaceScale="1.5" specularConstant="0.4" specularExponent="30" lightingColor="#fff" result="light">
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="light" in2="distorted" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="painted" />
          <feComposite in="painted" in2="distorted" operator="in" />
        </filter>

        {/* Filter 4: Rough/Messy Strokes (Variations, Beams) */}
        <filter id="strokeRough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03 0.03" numOctaves="4" result="noise" seed={data.seed + 2}/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" result="distorted" />
          <feSpecularLighting in="noise" surfaceScale="2" specularConstant="0.3" specularExponent="25" lightingColor="#fff" result="light">
             <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="light" in2="distorted" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="painted" />
          <feComposite in="painted" in2="distorted" operator="in" />
        </filter>

        {data.regions?.map((region) => (
            <clipPath id={region.id} key={region.id}>
                {region.points ? (
                    <polygon points={region.points.map(p => `${p.x},${p.y}`).join(' ')} />
                ) : (
                    <rect x="0" y={region.y} width={data.width} height={region.height} />
                )}
            </clipPath>
        ))}
      </defs>

      {/* Render Shapes Independently */}
      {data.shapes.map((shape) => {
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
  );
};
