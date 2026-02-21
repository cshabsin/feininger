import React from 'react';

export const FeiningerGemini3: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="400" height="600" className="max-w-full h-auto max-h-[70vh]">
      <defs>
        {/* Background Gradients */}
        <linearGradient id="sky-blue" x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#141f33" />
          <stop offset="100%" stopColor="#496585" />
        </linearGradient>
        <linearGradient id="sky-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8a825" />
          <stop offset="50%" stopColor="#f5cc4a" />
          <stop offset="100%" stopColor="#d9751e" />
        </linearGradient>
        
        {/* Water Gradients */}
        <linearGradient id="water-left" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3d5452" />
          <stop offset="100%" stopColor="#152120" />
        </linearGradient>
        <linearGradient id="water-right" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ad7121" />
          <stop offset="100%" stopColor="#471f09" />
        </linearGradient>

        {/* Sail Gradients */}
        <linearGradient id="sail-white-main" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d6cead" />
        </linearGradient>
        <linearGradient id="sail-white-shadow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d6cead" />
          <stop offset="100%" stopColor="#9ea4ab" />
        </linearGradient>
        
        <linearGradient id="sail-plum" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#210e17" />
          <stop offset="100%" stopColor="#4a1529" />
        </linearGradient>
        <linearGradient id="sail-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4281f" />
          <stop offset="100%" stopColor="#f04929" />
        </linearGradient>
        <linearGradient id="sail-orange" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f7982a" />
          <stop offset="100%" stopColor="#d94a11" />
        </linearGradient>

        {/* Canvas Texture Filter */}
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" result="turbulence" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.14 0" in="turbulence" result="coloredNoise" />
        </filter>
      </defs>

      {/* ================= BACKGROUND BASE ================= */}
      {/* Split the canvas into the cool left and warm right */}
      <polygon points="0,0 600,0 350,900 0,900" fill="url(#sky-blue)" />
      <polygon points="600,0 800,0 800,900 350,900" fill="url(#sky-gold)" />

      {/* ================= SKY PRISMS & SHARDS ================= */}
      {/* Left Blue/Grey Shards */}
      <polygon points="0,0 300,0 400,600 0,700" fill="#18273d" opacity="0.85" />
      <polygon points="100,0 500,0 400,800 150,900" fill="#335675" opacity="0.65" />
      <polygon points="0,200 250,300 200,900 0,900" fill="#20334a" opacity="0.7" />
      <polygon points="50,0 200,0 150,900 50,900" fill="#132338" opacity="0.4" style={{mixBlendMode: 'multiply'}} />

      {/* Right Gold/Orange Shards */}
      <polygon points="450,0 800,100 800,500 600,350" fill="#fad155" opacity="0.9" />
      <polygon points="550,0 800,300 750,900 450,750" fill="#e08e1b" opacity="0.7" />
      <polygon points="400,200 750,450 800,900 380,900" fill="#bf4c13" opacity="0.75" />
      <polygon points="650,0 750,0 750,900 550,900" fill="#f7cd59" opacity="0.35" style={{mixBlendMode: 'overlay'}} />

      {/* Cross-cutting Atmospheric Shards */}
      <polygon points="350,0 650,0 500,900 250,900" fill="#111824" opacity="0.4" style={{mixBlendMode: 'multiply'}} />
      <polygon points="200,100 700,500 550,900 250,800" fill="#d49333" opacity="0.3" style={{mixBlendMode: 'color-dodge'}} />
      <polygon points="0,500 400,600 350,900 0,850" fill="#4e6f8a" opacity="0.5" />

      {/* ================= WATER BASE & WAVES ================= */}
      {/* Water Base */}
      <polygon points="0,900 450,900 400,1200 0,1200" fill="url(#water-left)" />
      <polygon points="450,900 800,900 800,1200 400,1200" fill="url(#water-right)" />

      {/* Water Fragments (Reflections and Ripples) */}
      <polygon points="0,900 450,900 430,930 0,920" fill="#5f7578" opacity="0.6" />
      <polygon points="250,910 650,920 630,950 230,940" fill="#b08133" opacity="0.8" />
      <polygon points="450,930 800,920 800,960 430,970" fill="#c45614" opacity="0.75" />
      <polygon points="0,950 350,970 330,1020 0,990" fill="#293b39" opacity="0.85" />
      <polygon points="150,980 550,990 530,1040 130,1020" fill="#754b1d" opacity="0.7" />
      <polygon points="400,1000 800,970 800,1040 380,1080" fill="#731b0e" opacity="0.85" />
      <polygon points="0,1040 400,1080 380,1200 0,1200" fill="#151f1e" opacity="0.95" />
      <polygon points="300,1080 800,1040 800,1200 280,1200" fill="#451406" opacity="0.9" />
      <polygon points="200,1100 650,1120 630,1200 180,1200" fill="#0d0602" opacity="0.85" />

      {/* ================= BACKGROUND BOAT ================= */}
      <g id="distant-boat">
        <animateTransform attributeName="transform" type="translate" values="0,0; 500,0; -600,0; 0,0" keyTimes="0; 0.444; 0.445; 1" dur="150s" repeatCount="indefinite" additive="sum" />
        <animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0; 0.443; 0.444; 0.445; 0.446; 1" dur="150s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,8; 0,0" dur="5s" repeatCount="indefinite" additive="sum" />
        <polygon points="430,800 440,900 425,898" fill="#e8ebed" opacity="0.85" />
        <polygon points="440,800 455,901 440,900" fill="#a4b2ba" opacity="0.8" />
        {/* Distant Reflection */}
        <polygon points="425,898 455,901 445,940 435,940" fill="#e8ebed" opacity="0.25" />
      </g>

      {/* ================= LEFT BOAT (COOL / WHITE) ================= */}
      <g id="left-boat">
        <animateTransform attributeName="transform" type="translate" values="0,0; 800,0; -600,0; 0,0" keyTimes="0; 0.6; 0.601; 1" dur="70s" repeatCount="indefinite" additive="sum" />
        <animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0; 0.599; 0.6; 0.601; 0.602; 1" dur="70s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,15; 0,0" dur="7s" repeatCount="indefinite" additive="sum" />
        {/* Sails */}
        <polygon points="120,890 230,300 250,895" fill="url(#sail-white-main)" />
        <polygon points="230,300 290,898 250,895" fill="url(#sail-white-shadow)" />
        <polygon points="230,300 320,900 290,898" fill="#8d9499" />
        {/* Overlapping translucent sail fold */}
        <polygon points="180,500 150,892 170,893" fill="#e0e3e6" opacity="0.6" />
        
        {/* Hull */}
        <polygon points="110,890 340,900 290,930 130,920" fill="#2b2621" />
        <polygon points="110,890 200,905 180,925 130,920" fill="#453d36" opacity="0.8" />
        
        {/* Reflections */}
        <polygon points="130,920 290,930 260,1100 160,1060" fill="#cfc8ab" opacity="0.3" />
        <polygon points="180,925 250,928 230,1020 190,1000" fill="#ffffff" opacity="0.2" />
        
        {/* Architectural Rigging / Light Lines */}
        <line x1="230" y1="300" x2="210" y2="50" stroke="#ffffff" opacity="0.3" strokeWidth="2" />
        <line x1="110" y1="890" x2="0" y2="885" stroke="#ffffff" opacity="0.2" strokeWidth="2" />
      </g>

      {/* ================= RIGHT BOATS (WARM / DARK / RED) ================= */}
      <g id="right-boat">
        <animateTransform attributeName="transform" type="translate" values="0,0; -1000,0; 500,0; 0,0" keyTimes="0; 0.692; 0.693; 1" dur="90s" repeatCount="indefinite" additive="sum" />
        <animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0; 0.691; 0.692; 0.693; 0.694; 1" dur="90s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,20; 0,0" dur="9s" repeatCount="indefinite" additive="sum" />
        {/* Back Dark Sail */}
        <polygon points="540,900 480,150 650,910" fill="url(#sail-plum)" />
        {/* Dark Sail Shadow Plane */}
        <polygon points="480,150 690,910 650,910" fill="#0f0407" />
        
        {/* Front Vivid Red Sail */}
        <polygon points="620,910 690,420 750,900" fill="url(#sail-red)" />
        {/* Red Sail Shadow */}
        <polygon points="690,420 790,895 750,900" fill="#69100d" />
        
        {/* Overlapping Translucent Fiery Orange Sail */}
        <polygon points="660,910 720,550 820,890" fill="url(#sail-orange)" style={{mixBlendMode: 'multiply'}} opacity="0.9" />
        <polygon points="640,910 680,600 750,900" fill="#facc43" opacity="0.4" style={{mixBlendMode: 'overlay'}} />

        {/* Hull */}
        <polygon points="520,900 800,895 750,960 550,940" fill="#120504" />
        <polygon points="520,900 620,915 600,950 550,940" fill="#2e0f0c" opacity="0.9" />

        {/* Reflections */}
        <polygon points="550,940 750,960 700,1150 580,1120" fill="#380d15" opacity="0.65" />
        <polygon points="630,948 720,956 690,1080 640,1050" fill="#a82718" opacity="0.75" />
        
        {/* Architectural Rigging / Light Lines */}
        <line x1="480" y1="150" x2="460" y2="0" stroke="#000000" opacity="0.4" strokeWidth="2" />
        <line x1="690" y1="420" x2="710" y2="0" stroke="#ff9b7d" opacity="0.35" strokeWidth="1.5" />
        <line x1="800" y1="895" x2="800" y2="895" stroke="#000000" opacity="0.4" strokeWidth="2" />
      </g>

      {/* ================= FOREGROUND PRISMATIC RAYS ================= */}
      {/* These intersecting global shards give the signature cubist "prism" look */}
      <polygon points="0,0 800,650 800,750 0,100" fill="#ffffff" opacity="0.05" style={{mixBlendMode: 'overlay'}} />
      <polygon points="800,0 0,1050 0,1150 800,100" fill="#000000" opacity="0.12" style={{mixBlendMode: 'multiply'}} />
      <polygon points="200,-100 650,1200 550,1200 100,-100" fill="#ffffff" opacity="0.06" style={{mixBlendMode: 'overlay'}} />
      <polygon points="500,-100 50,1200 150,1200 600,-100" fill="#000000" opacity="0.15" style={{mixBlendMode: 'multiply'}} />
      
      <polygon points="400,0 450,1200 350,1200 300,0" fill="#52789e" opacity="0.1" style={{mixBlendMode: 'color-dodge'}} />

      {/* ================= CANVAS TEXTURE OVERLAY ================= */}
      {/* Applies a subtle grain over the entire vector graphic to mimic paint and canvas */}
      <rect width="100%" height="100%" filter="url(#noise)" style={{mixBlendMode: 'multiply', pointerEvents: 'none'}} />
    </svg>
  );
};
