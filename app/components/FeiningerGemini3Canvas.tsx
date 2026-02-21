"use client";

import React, { useRef, useEffect } from 'react';
import { FeiningerData } from '@/lib/feininger';

interface FeiningerGemini3CanvasProps {
  data: FeiningerData;
}

export const FeiningerGemini3Canvas: React.FC<FeiningerGemini3CanvasProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = data.width;
    const height = data.height;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.maxHeight = '85vh';

    // Helper to draw a polygon
    const drawPolygon = (points: {x: number, y: number}[], fill: string | CanvasGradient | CanvasPattern, opacity: number = 1, blendMode: GlobalCompositeOperation = 'source-over') => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.globalCompositeOperation = blendMode;
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.restore();
    };

    // Noise Pattern
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 256;
    noiseCanvas.height = 256;
    const nCtx = noiseCanvas.getContext('2d');
    if (nCtx) {
      const imgData = nCtx.createImageData(256, 256);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const val = Math.random() * 255;
        imgData.data[i] = val;
        imgData.data[i + 1] = val;
        imgData.data[i + 2] = val;
        imgData.data[i + 3] = 35; // Alpha
      }
      nCtx.putImageData(imgData, 0, 0);
    }
    const noisePattern = ctx.createPattern(noiseCanvas, 'repeat');

    // Interpolation helper
    const interpolate = (values: number[], keyTimes: number[], progress: number) => {
      for (let i = 0; i < keyTimes.length - 1; i++) {
        if (progress >= keyTimes[i] && progress <= keyTimes[i + 1]) {
          const t = (progress - keyTimes[i]) / (keyTimes[i + 1] - keyTimes[i]);
          return values[i] + t * (values[i + 1] - values[i]);
        }
      }
      return values[values.length - 1];
    };

    let animationFrameId: number;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);

      // 1. Static Shapes (Background, Shards, Rays)
      data.shapes.filter(s => !s.id.includes('boat')).forEach(shape => {
        drawPolygon(shape.points, shape.fill, shape.opacity, shape.blendMode as any);
      });

      // 2. Animated Boats
      const getBoatShapes = (prefix: string) => data.shapes.filter(s => s.id.startsWith(prefix));

      // CALCULATIONS
      const distantBoatProgress = (time % 150000) / 150000;
      const distantBoatX = interpolate([0, 500, -600, 0], [0, 0.444, 0.445, 1], distantBoatProgress);
      const distantBoatY = interpolate([0, 8, 0], [0, 0.5, 1], (time % 5000) / 5000);
      const distantBoatOpacity = interpolate([1, 1, 0, 0, 1, 1], [0, 0.443, 0.444, 0.445, 0.446, 1], distantBoatProgress);

      const leftBoatProgress = (time % 70000) / 70000;
      const leftBoatX = interpolate([0, 800, -600, 0], [0, 0.6, 0.601, 1], leftBoatProgress);
      const leftBoatY = interpolate([0, 15, 0], [0, 0.5, 1], (time % 7000) / 7000);
      const leftBoatOpacity = interpolate([1, 1, 0, 0, 1, 1], [0, 0.599, 0.6, 0.601, 0.602, 1], leftBoatProgress);

      const rightBoatProgress = (time % 90000) / 90000;
      const rightBoatX = interpolate([0, -1000, 500, 0], [0, 0.692, 0.693, 1], rightBoatProgress);
      const rightBoatY = interpolate([0, 20, 0], [0, 0.5, 1], (time % 9000) / 9000);
      const rightBoatOpacity = interpolate([1, 1, 0, 0, 1, 1], [0, 0.691, 0.692, 0.693, 0.694, 1], rightBoatProgress);

      // DISTANT BOAT
      ctx.save();
      ctx.translate(distantBoatX, distantBoatY);
      getBoatShapes('distant-boat').forEach(shape => {
        drawPolygon(shape.points, shape.fill, shape.opacity * distantBoatOpacity, shape.blendMode as any);
      });
      ctx.restore();

      // LEFT BOAT
      ctx.save();
      ctx.translate(leftBoatX, leftBoatY);
      getBoatShapes('left-boat').forEach(shape => {
        drawPolygon(shape.points, shape.fill, shape.opacity * leftBoatOpacity, shape.blendMode as any);
      });
      ctx.restore();

      // RIGHT BOAT
      ctx.save();
      ctx.translate(rightBoatX, rightBoatY);
      getBoatShapes('right-boat').forEach(shape => {
        drawPolygon(shape.points, shape.fill, shape.opacity * rightBoatOpacity, shape.blendMode as any);
      });
      ctx.restore();

      // 3. NOISE OVERLAY
      if (noisePattern) {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = noisePattern;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [data]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ backgroundColor: '#111827', display: 'block' }} 
      className="max-w-full h-auto max-h-[85vh] shadow-2xl"
    />
  );
};
