import React, { useRef, useEffect } from 'react';
import { FeiningerData, Point } from '@/lib/feininger';

interface FeiningerCanvasProps {
  data: FeiningerData;
}

export const FeiningerCanvas: React.FC<FeiningerCanvasProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = data.width * dpr;
    canvas.height = data.height * dpr;
    ctx.scale(dpr, dpr);
    // Set display size
    canvas.style.width = `${data.width}px`;
    canvas.style.height = `${data.height}px`;

    // 1. Background
    ctx.clearRect(0, 0, data.width, data.height);
    ctx.fillStyle = data.version === 'v2' ? '#F5F5F5' : '#F0F8FF';
    ctx.fillRect(0, 0, data.width, data.height);

    // Helper: Draw Rough Polygon
    const drawRoughPolygon = (points: Point[], fill: string, opacity: number, isBlurred: boolean = false) => {
      ctx.save();

      if (isBlurred) {
        ctx.filter = 'blur(2px)';
      }

      // Base Fill
      ctx.fillStyle = fill;
      ctx.globalAlpha = opacity;

      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();

      // Rough Strokes (Simulate hand-drawn edges)
      // Skip strokes for blurred elements (sea, ground) to make them smoother
      if (!isBlurred) {
        // We draw 2 passes of strokes with slight jitter
        ctx.strokeStyle = fill;
        ctx.globalAlpha = Math.min(1, opacity * 1.8); // Slightly stronger stroke
        ctx.lineWidth = 0.5;

        const passes = 2;
        for (let k = 0; k < passes; k++) {
           ctx.beginPath();
           points.forEach((p, i) => {
               // Jitter amount
               const jAmt = 1.5;
               const jx = (Math.random() - 0.5) * jAmt;
               const jy = (Math.random() - 0.5) * jAmt;

               if (i === 0) ctx.moveTo(p.x + jx, p.y + jy);
               else ctx.lineTo(p.x + jx, p.y + jy);
           });
           // Close loop
           const p0 = points[0];
           ctx.lineTo(p0.x + (Math.random() - 0.5) * 1.5, p0.y + (Math.random() - 0.5) * 1.5);
           ctx.stroke();
        }
      }

      ctx.restore();
    };

    // 2. Render Shapes
    data.shapes.forEach(shape => {
      ctx.save();

      // Blend Mode
      // Canvas supports: 'source-over', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', etc.
      if (shape.blendMode === 'normal') {
        ctx.globalCompositeOperation = 'source-over';
      } else if (shape.blendMode) {
        ctx.globalCompositeOperation = shape.blendMode;
      } else {
        ctx.globalCompositeOperation = 'multiply';
      }

      // Clipping Region
      if (shape.clipPathId && data.regions) {
        const region = data.regions.find(r => r.id === shape.clipPathId);
        if (region) {
          ctx.beginPath();
          if (region.points) {
             region.points.forEach((p, i) => {
               if (i === 0) ctx.moveTo(p.x, p.y);
               else ctx.lineTo(p.x, p.y);
             });
             ctx.closePath();
          } else if (region.y !== undefined && region.height !== undefined) {
             ctx.rect(0, region.y, data.width, region.height);
          }
          ctx.clip();
        }
      }

      // Blur sea and ground facets (but not grass or figures)
      const isBlurred = shape.id.includes('sea') || shape.id.includes('ground-facet');
      drawRoughPolygon(shape.points, shape.fill, shape.opacity, isBlurred);

      ctx.restore();
    });

    // 3. Texture Overlay (Noise)
    // Create an offscreen canvas for noise pattern
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 128; // Tile size
    noiseCanvas.height = 128;
    const nCtx = noiseCanvas.getContext('2d');
    if (nCtx) {
        const imgData = nCtx.createImageData(128, 128);
        const buffer = new Uint32Array(imgData.data.buffer);

        for (let i = 0; i < buffer.length; i++) {
            // Random noise
            if (Math.random() < 0.5) {
               // White/Grey noise
               // ARGB (little endian)
               // Alpha = 255 (full opaque on the pattern canvas, but we will use low alpha on main canvas)
               // But for 'overlay' blend mode on main canvas, we want greyscale noise.
               // Let's make it semi-transparent black/white
               const isWhite = Math.random() > 0.5;
               const alpha = Math.floor(Math.random() * 50); // 0-50 alpha
               // ABGR
               if (isWhite) {
                   buffer[i] = (alpha << 24) | (255 << 16) | (255 << 8) | 255;
               } else {
                   buffer[i] = (alpha << 24) | (0 << 16) | (0 << 8) | 0;
               }
            }
        }
        nCtx.putImageData(imgData, 0, 0);

        ctx.save();
        ctx.globalCompositeOperation = 'overlay';
        const pattern = ctx.createPattern(noiseCanvas, 'repeat');
        if (pattern) {
            ctx.fillStyle = pattern;
            ctx.globalAlpha = 0.4; // Adjust strength
            ctx.fillRect(0, 0, data.width, data.height);
        }
        ctx.restore();
    }

  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full h-auto max-h-[70vh] bg-white"
    />
  );
};
