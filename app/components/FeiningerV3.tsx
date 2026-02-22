import React from 'react';
import { FeiningerData } from '@/lib/feininger';

interface FeiningerV3Props {
  data: FeiningerData;
}

export const FeiningerV3: React.FC<FeiningerV3Props> = ({ data }) => {
  // Helper to filter shapes by ID prefix
  const getShapes = (prefix: string) => data.shapes.filter(s => s.id.startsWith(prefix));

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox={`0 0 ${data.width} ${data.height}`} 
      width="100%" 
      height="100%" 
      className="max-w-full h-auto max-h-[85vh]"
      style={{ backgroundColor: '#111827' }}
    >
      <defs>
        {/* Mask to occlude things behind the front (right) boat */}
        <mask id="right-boat-occlusion-mask">
          <rect x="0" y="0" width={data.width} height={data.height} fill="white" />
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0; -1000,0; 500,0; 0,0" keyTimes="0; 0.692; 0.693; 1" dur="90s" repeatCount="indefinite" additive="sum" />
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,20; 0,0" dur="9s" repeatCount="indefinite" additive="sum" />
            {getShapes('right-boat').map(shape => (
              <polygon 
                key={`${shape.id}-mask`}
                points={shape.points.map(p => `${p.x},${p.y}`).join(' ')} 
                fill="black" 
              />
            ))}
          </g>
        </mask>

        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" result="turbulence" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.14 0" in="turbulence" result="coloredNoise" />
        </filter>
      </defs>

      {/* 1. BACKGROUND & SHARDS (Static) */}
      {data.shapes.filter(s => !s.id.includes('boat')).map(shape => (
        <polygon 
          key={shape.id}
          points={shape.points.map(p => `${p.x},${p.y}`).join(' ')}
          fill={shape.fill}
          opacity={shape.opacity}
          style={{ mixBlendMode: shape.blendMode as any }}
        />
      ))}

      {/* 2. DISTANT BOAT */}
      <g id="distant-boat">
        <animateTransform attributeName="transform" type="translate" values="0,0; 500,0; -600,0; 0,0" keyTimes="0; 0.444; 0.445; 1" dur="150s" repeatCount="indefinite" additive="sum" />
        <animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0; 0.443; 0.444; 0.445; 0.446; 1" dur="150s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,8; 0,0" dur="5s" repeatCount="indefinite" additive="sum" />
        {getShapes('distant-boat').map(shape => (
          <polygon 
            key={shape.id}
            points={shape.points.map(p => `${p.x},${p.y}`).join(' ')}
            fill={shape.fill}
            opacity={shape.opacity}
            style={{ mixBlendMode: shape.blendMode as any }}
          />
        ))}
      </g>

      {/* 3. LEFT BOAT */}
      <g id="left-boat" mask="url(#right-boat-occlusion-mask)">
        <animateTransform attributeName="transform" type="translate" values="0,0; 800,0; -600,0; 0,0" keyTimes="0; 0.6; 0.601; 1" dur="70s" repeatCount="indefinite" additive="sum" />
        <animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0; 0.599; 0.6; 0.601; 0.602; 1" dur="70s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,15; 0,0" dur="7s" repeatCount="indefinite" additive="sum" />
        {getShapes('left-boat').map(shape => (
          <polygon 
            key={shape.id}
            points={shape.points.map(p => `${p.x},${p.y}`).join(' ')}
            fill={shape.fill}
            opacity={shape.opacity}
            style={{ mixBlendMode: shape.blendMode as any }}
          />
        ))}
      </g>

            {/* 4. RIGHT BOAT */}
            <g id="right-boat">
              <animateTransform attributeName="transform" type="translate" values="0,0; -1000,0; 500,0; 0,0" keyTimes="0; 0.692; 0.693; 1" dur="90s" repeatCount="indefinite" additive="sum" />
              <animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0; 0.691; 0.692; 0.693; 0.694; 1" dur="90s" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,20; 0,0" dur="9s" repeatCount="indefinite" additive="sum" />
              {getShapes('right-boat').map(shape => (
                <polygon 
                  key={shape.id}
                  points={shape.points.map(p => `${p.x},${p.y}`).join(' ')}
                  fill={shape.fill}
                  opacity={shape.opacity}
                  style={{ mixBlendMode: shape.blendMode as any }}
                />
              ))}
            </g>
      
            {/* 5. FOREGROUND BOAT (Occasionally generated) */}
            {getShapes('foreground-boat').length > 0 && (
              <g id="foreground-boat">
                <animateTransform attributeName="transform" type="translate" values="0,0; 1200,0; -800,0; 0,0" keyTimes="0; 0.6; 0.601; 1" dur="110s" repeatCount="indefinite" additive="sum" />
                <animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0; 0.599; 0.6; 0.601; 0.602; 1" dur="110s" repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="translate" values="0,0; 0,30; 0,0" dur="12s" repeatCount="indefinite" additive="sum" />
                {getShapes('foreground-boat').map(shape => (
                  <polygon 
                    key={shape.id}
                    points={shape.points.map(p => `${p.x},${p.y}`).join(' ')}
                    fill={shape.fill}
                    opacity={shape.opacity}
                    style={{ mixBlendMode: shape.blendMode as any }}
                  />
                ))}
              </g>
            )}
            <rect width="100%" height="100%" filter="url(#noise)" style={{mixBlendMode: 'multiply', pointerEvents: 'none'}} />
    </svg>
  );
};
