"use client";

import React, { useRef, useEffect } from 'react';

type Point = { x: number; y: number };

export const FeiningerGemini3Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 1200;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.maxHeight = '85vh';

    // Helper to draw a polygon
    const drawPolygon = (points: Point[], fill: string | CanvasGradient | CanvasPattern, opacity: number = 1, blendMode: GlobalCompositeOperation = 'source-over') => {
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

    const parsePoints = (s: string): Point[] => {
      return s.split(' ').map(p => {
        const [x, y] = p.split(',').map(Number);
        return { x, y };
      });
    };

    // Gradients
    const skyBlue = ctx.createLinearGradient(0, 0, 400, 900);
    skyBlue.addColorStop(0, "#141f33");
    skyBlue.addColorStop(1, "#496585");

    const skyGold = ctx.createLinearGradient(600, 0, 600, 900);
    skyGold.addColorStop(0, "#e8a825");
    skyGold.addColorStop(0.5, "#f5cc4a");
    skyGold.addColorStop(1, "#d9751e");

    const waterLeft = ctx.createLinearGradient(0, 900, 0, 1200);
    waterLeft.addColorStop(0, "#3d5452");
    waterLeft.addColorStop(1, "#152120");

    const waterRight = ctx.createLinearGradient(450, 900, 450, 1200);
    waterRight.addColorStop(0, "#ad7121");
    waterRight.addColorStop(1, "#471f09");

    const sailWhiteMain = ctx.createLinearGradient(120, 300, 320, 300);
    sailWhiteMain.addColorStop(0, "#ffffff");
    sailWhiteMain.addColorStop(1, "#d6cead");

    const sailWhiteShadow = ctx.createLinearGradient(230, 300, 320, 300);
    sailWhiteShadow.addColorStop(0, "#d6cead");
    sailWhiteShadow.addColorStop(1, "#9ea4ab");

    const sailPlum = ctx.createLinearGradient(540, 150, 650, 910);
    sailPlum.addColorStop(0, "#210e17");
    sailPlum.addColorStop(1, "#4a1529");

    const sailRed = ctx.createLinearGradient(620, 420, 750, 900);
    sailRed.addColorStop(0, "#c4281f");
    sailRed.addColorStop(1, "#f04929");

    const sailOrange = ctx.createLinearGradient(660, 550, 660, 910);
    sailOrange.addColorStop(0, "#f7982a");
    sailOrange.addColorStop(1, "#d94a11");

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

      // 1. BACKGROUND BASE
      drawPolygon(parsePoints("0,0 600,0 350,900 0,900"), skyBlue);
      drawPolygon(parsePoints("600,0 800,0 800,900 350,900"), skyGold);

      // 2. SKY PRISMS & SHARDS
      drawPolygon(parsePoints("0,0 300,0 400,600 0,700"), "#18273d", 0.85);
      drawPolygon(parsePoints("100,0 500,0 400,800 150,900"), "#335675", 0.65);
      drawPolygon(parsePoints("0,200 250,300 200,900 0,900"), "#20334a", 0.7);
      drawPolygon(parsePoints("50,0 200,0 150,900 50,900"), "#132338", 0.4, 'multiply');

      drawPolygon(parsePoints("450,0 800,100 800,500 600,350"), "#fad155", 0.9);
      drawPolygon(parsePoints("550,0 800,300 750,900 450,750"), "#e08e1b", 0.7);
      drawPolygon(parsePoints("400,200 750,450 800,900 380,900"), "#bf4c13", 0.75);
      drawPolygon(parsePoints("650,0 750,0 750,900 550,900"), "#f7cd59", 0.35, 'overlay');

      drawPolygon(parsePoints("350,0 650,0 500,900 250,900"), "#111824", 0.4, 'multiply');
      drawPolygon(parsePoints("200,100 700,500 550,900 250,800"), "#d49333", 0.3, 'color-dodge');
      drawPolygon(parsePoints("0,500 400,600 350,900 0,850"), "#4e6f8a", 0.5);

      // 3. WATER BASE & WAVES
      drawPolygon(parsePoints("0,900 450,900 400,1200 0,1200"), waterLeft);
      drawPolygon(parsePoints("450,900 800,900 800,1200 400,1200"), waterRight);

      drawPolygon(parsePoints("0,900 450,900 430,930 0,920"), "#5f7578", 0.6);
      drawPolygon(parsePoints("250,910 650,920 630,950 230,940"), "#b08133", 0.8);
      drawPolygon(parsePoints("450,930 800,920 800,960 430,970"), "#c45614", 0.75);
      drawPolygon(parsePoints("0,950 350,970 330,1020 0,990"), "#293b39", 0.85);
      drawPolygon(parsePoints("150,980 550,990 530,1040 130,1020"), "#754b1d", 0.7);
      drawPolygon(parsePoints("400,1000 800,970 800,1040 380,1080"), "#731b0e", 0.85);
      drawPolygon(parsePoints("0,1040 400,1080 380,1200 0,1200"), "#151f1e", 0.95);
      drawPolygon(parsePoints("300,1080 800,1040 800,1200 280,1200"), "#451406", 0.9);
      drawPolygon(parsePoints("200,1100 650,1120 630,1200 180,1200"), "#0d0602", 0.85);

      // 4. ANIMATIONS CALCULATIONS
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

      // 5. DISTANT BOAT
      ctx.save();
      ctx.translate(distantBoatX, distantBoatY);
      drawPolygon(parsePoints("430,800 440,900 425,898"), "#e8ebed", 0.85 * distantBoatOpacity);
      drawPolygon(parsePoints("440,800 455,901 440,900"), "#a4b2ba", 0.8 * distantBoatOpacity);
      drawPolygon(parsePoints("425,898 455,901 445,940 435,940"), "#e8ebed", 0.25 * distantBoatOpacity);
      ctx.restore();

      // 6. LEFT BOAT
      ctx.save();
      ctx.translate(leftBoatX, leftBoatY);
      ctx.globalAlpha = leftBoatOpacity;
      drawPolygon(parsePoints("120,890 230,300 250,895"), sailWhiteMain);
      drawPolygon(parsePoints("230,300 290,898 250,895"), sailWhiteShadow);
      drawPolygon(parsePoints("230,300 320,900 290,898"), "#8d9499");
      drawPolygon(parsePoints("180,500 150,892 170,893"), "#e0e3e6", 0.6);
      drawPolygon(parsePoints("110,890 340,900 290,930 130,920"), "#2b2621");
      drawPolygon(parsePoints("110,890 200,905 180,925 130,920"), "#453d36", 0.8);
      drawPolygon(parsePoints("130,920 290,930 260,1100 160,1060"), "#cfc8ab", 0.3);
      drawPolygon(parsePoints("180,925 250,928 230,1020 190,1000"), "#ffffff", 0.2);
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.globalAlpha = 0.3;
      ctx.beginPath(); ctx.moveTo(230, 300); ctx.lineTo(210, 50); ctx.stroke();
      ctx.restore();

      // 7. RIGHT BOAT
      ctx.save();
      ctx.translate(rightBoatX, rightBoatY);
      ctx.globalAlpha = rightBoatOpacity;
      drawPolygon(parsePoints("540,900 480,150 650,910"), sailPlum);
      drawPolygon(parsePoints("480,150 690,910 650,910"), "#0f0407");
      drawPolygon(parsePoints("620,910 690,420 750,900"), sailRed);
      drawPolygon(parsePoints("690,420 790,895 750,900"), "#69100d");
      drawPolygon(parsePoints("660,910 720,550 820,890"), sailOrange, 0.9, 'multiply');
      drawPolygon(parsePoints("640,910 680,600 750,900"), "#facc43", 0.4, 'overlay');
      drawPolygon(parsePoints("520,900 800,895 750,960 550,940"), "#120504");
      drawPolygon(parsePoints("520,900 620,915 600,950 550,940"), "#2e0f0c", 0.9);
      drawPolygon(parsePoints("550,940 750,960 700,1150 580,1120"), "#380d15", 0.65);
      drawPolygon(parsePoints("630,948 720,956 690,1080 640,1050"), "#a82718", 0.75);
      ctx.restore();

      // 8. FOREGROUND PRISMATIC RAYS
      drawPolygon(parsePoints("0,0 800,650 800,750 0,100"), "#ffffff", 0.05, 'overlay');
      drawPolygon(parsePoints("800,0 0,1050 0,1150 800,100"), "#000000", 0.12, 'multiply');
      drawPolygon(parsePoints("200,-100 650,1200 550,1200 100,-100"), "#ffffff", 0.06, 'overlay');
      drawPolygon(parsePoints("500,-100 50,1200 150,1200 600,-100"), "#000000", 0.15, 'multiply');
      drawPolygon(parsePoints("400,0 450,1200 350,1200 300,0"), "#52789e", 0.1, 'color-dodge');

      // 9. NOISE OVERLAY
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
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ backgroundColor: '#111827', display: 'block' }} 
      className="max-w-full h-auto max-h-[85vh] shadow-2xl"
    />
  );
};
