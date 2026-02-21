export interface Point {
  x: number;
  y: number;
}

export interface Shape {
  id: string;
  type: 'polygon';
  points: Point[];
  fill: string;
  opacity: number;
  clipPathId?: string;
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion';
}

export interface Region {
  id: string;
  y?: number; // Optional now, used for rect
  height?: number;
  points?: Point[]; // Used for polygon clip
}

export interface FeiningerData {
  width: number;
  height: number;
  shapes: Shape[];
  horizonY: number;
  version: 'v1' | 'v2' | 'v3' | 'gemini3';
  regions?: Region[];
  seed: number;
}

const PALETTE_V1 = [
  "#708090", // SlateGray
  "#778899", // LightSlateGray
  "#B0C4DE", // LightSteelBlue
  "#4682B4", // SteelBlue
  "#5F9EA0", // CadetBlue
  "#D2B48C", // Tan (Ochre-ish)
  "#F5DEB3", // Wheat
  "#F0F8FF", // AliceBlue
  "#E0FFFF", // LightCyan
  "#D3D3D3", // LightGray
  "#2F4F4F", // DarkSlateGray (for depth)
];

const PALETTE_V2_SKY = ["#A9A9A9", "#778899", "#D3D3D3", "#F0F8FF"];
const PALETTE_V2_SEA = ["#1E3F5A", "#4682B4", "#5F9EA0", "#2F4F4F"];
const PALETTE_V2_GROUND = ["#2F2F2F", "#363636", "#3E3E3E", "#424242", "#483C32", "#3E2723"]; // Reduced contrast, softer darks/browns
const PALETTE_V2_SUNDRESS = ["#CD5C5C", "#DAA520", "#20B2AA", "#D8BFD8", "#F4A460"]; // Muted colorful
const PALETTE_V2_SUIT = ["#000000", "#2F2F2F", "#3E2723", "#1C1C1C", "#5D4037", "#4E342E", "#795548"];

function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max));
}

function randomChoice<T>(arr: T[]): T {
    return arr[randomInt(0, arr.length)];
}

// --- V1 Generator (Original Prismatism) ---

export function generateFeiningerV1(width: number, height: number): FeiningerData {
  const shapes: Shape[] = [];
  const horizonY = height * 0.66;
  const seed = randomInt(1, 1000);

  // 1. Sky/Sea Background (Large blocks)
  shapes.push({
    id: 'sky',
    type: 'polygon',
    points: [{x: 0, y: 0}, {x: width, y: 0}, {x: width, y: horizonY}, {x: 0, y: horizonY}],
    fill: "#E0FFFF",
    opacity: 0.3
  });
  shapes.push({
    id: 'sea',
    type: 'polygon',
    points: [{x: 0, y: horizonY}, {x: width, y: horizonY}, {x: width, y: height}, {x: 0, y: height}],
    fill: "#708090",
    opacity: 0.3
  });

  // 2. Sails (Tall, thin triangles)
  const numSails = randomInt(5, 12);
  
  for (let i = 0; i < numSails; i++) {
    const baseX = randomRange(width * 0.1, width * 0.9);
    const sailWidth = randomRange(width * 0.02, width * 0.08);
    const sailHeight = randomRange(height * 0.2, height * 0.5);
    
    // Slight lean/jitter
    const topX = baseX + randomRange(-sailWidth, sailWidth) * 2; 
    const topY = horizonY - sailHeight;

    const sailColor = randomChoice(PALETTE_V1);
    const sailOpacity = randomRange(0.2, 0.5); 

    // Main Sail
    shapes.push({
      id: `sail-${i}`,
      type: 'polygon',
      points: [
        { x: baseX - sailWidth / 2, y: horizonY },
        { x: baseX + sailWidth / 2, y: horizonY },
        { x: topX, y: topY }
      ],
      fill: sailColor,
      opacity: sailOpacity
    });

    // Reflection
    shapes.push({
      id: `reflection-${i}`,
      type: 'polygon',
      points: [
        { x: baseX - sailWidth / 2, y: horizonY },
        { x: baseX + sailWidth / 2, y: horizonY },
        { x: topX + randomRange(-10, 10), y: horizonY + sailHeight * randomRange(0.8, 1.2) }
      ],
      fill: sailColor,
      opacity: sailOpacity * 0.6
    });
  }

  // 3. Shards of Light
  const numBeams = randomInt(5, 10);
  for (let i = 0; i < numBeams; i++) {
    const startX = randomRange(0, width);
    const startY = randomRange(0, height);
    
    const pts: Point[] = [];
    pts.push({ x: startX, y: startY });
    pts.push({ x: startX + randomRange(-200, 200), y: startY + randomRange(200, 600) });
    pts.push({ x: startX + randomRange(100, 400), y: startY + randomRange(100, 500) });

    shapes.push({
      id: `beam-${i}`,
      type: 'polygon',
      points: pts,
      fill: randomChoice(PALETTE_V1),
      opacity: randomRange(0.1, 0.3)
    });
  }

  // 4. "Crystalline" Lines
  const numLines = randomInt(3, 7);
  for (let i = 0; i < numLines; i++) {
     const x1 = randomRange(0, width);
     const y1 = randomRange(0, height * 0.8);
     const length = randomRange(100, 500);
     const angle = randomRange(0, Math.PI * 2);
     
     const x2 = x1 + Math.cos(angle) * length;
     const y2 = y1 + Math.sin(angle) * length;

     const thickness = 1;
     shapes.push({
       id: `line-${i}`,
       type: 'polygon',
       points: [
         {x: x1, y: y1},
         {x: x2, y: y2},
         {x: x2 + thickness, y: y2 + thickness},
         {x: x1 + thickness, y: y1 + thickness}
       ],
       fill: "#F0F8FF", 
       opacity: 0.4
     });
  }

  return { width, height, shapes, horizonY, version: 'v1', seed };
}

// --- V2 Generator (Figures on Shore) ---

export function generateFeiningerV2(width: number, height: number, forceWaldo: boolean = false): FeiningerData {
  const shapes: Shape[] = [];
  const seed = randomInt(1, 1000);
  
  // Define Zones
  // Ground: Slanted horizon. 
  // Base height ~12% but with +/- skew
  const groundBaseH = height * 0.12;
  const skew = randomRange(-height * 0.05, height * 0.05);
  
  const groundYLeft = (height - groundBaseH) + skew;
  const groundYRight = (height - groundBaseH) - skew;

  // Sea: Above Ground, ~22%
  const seaHeight = height * 0.22;
  // Sea top is flat for the horizon
  const seaY = Math.min(groundYLeft, groundYRight) - seaHeight;
  
  // Sky: Top ~66% (from 0 to seaY)
  const skyHeight = seaY;
  
  const horizonY = seaY; 

  const regions: Region[] = [
    { id: 'cp-sky', points: [{x:0, y:0}, {x:width, y:0}, {x:width, y:seaY}, {x:0, y:seaY}] },
    { id: 'cp-sea', points: [{x:0, y:seaY}, {x:width, y:seaY}, {x:width, y:groundYRight}, {x:0, y:groundYLeft}] },
    { id: 'cp-ground', points: [{x:0, y:groundYLeft}, {x:width, y:groundYRight}, {x:width, y:height}, {x:0, y:height}] }
  ];

  // 1. Base Layers
  // Sky
  shapes.push({
    id: 'base-sky',
    type: 'polygon',
    points: [{x: 0, y: 0}, {x: width, y: 0}, {x: width, y: seaY}, {x: 0, y: seaY}],
    fill: "#D3D3D3",
    opacity: 0.5
  });
  // Sea
  shapes.push({
    id: 'base-sea',
    type: 'polygon',
    points: [{x: 0, y: seaY}, {x: width, y: seaY}, {x: width, y: groundYRight}, {x: 0, y: groundYLeft}],
    fill: "#4682B4",
    opacity: 0.6
  });
  // Ground
  shapes.push({
    id: 'base-ground',
    type: 'polygon',
    points: [{x: 0, y: groundYLeft}, {x: width, y: groundYRight}, {x: width, y: height}, {x: 0, y: height}],
    fill: "#1A1A1A",
    opacity: 0.9
  });

  // 2. Broad Gradual Polygons (Variation)
  // Instead of chaotic small triangles, we want large, sweeping partitions.
  const addVariation = (yMin: number, yMax: number, palette: string[], count: number, idPrefix: string, clipId: string) => {
    const regionHeight = yMax - yMin;
    for (let i = 0; i < count; i++) {
        // Create large overlays that span a good chunk of the width
        const xStart = randomRange(-width * 0.2, width * 1.2);
        const widthSpan = randomRange(width * 0.4, width * 0.8);
        
        // Simple quadrilateral or large triangle
        const pts: Point[] = [];
        
        const isTriangle = Math.random() > 0.5;
        
        if (isTriangle) {
            pts.push({ x: xStart, y: yMin });
            pts.push({ x: xStart + widthSpan, y: yMin });
            pts.push({ x: xStart + widthSpan / 2 + randomRange(-100, 100), y: yMax });
        } else {
             // Slanted block
             const slant = randomRange(-50, 50);
             pts.push({ x: xStart, y: yMin });
             pts.push({ x: xStart + widthSpan, y: yMin });
             pts.push({ x: xStart + widthSpan + slant, y: yMax });
             pts.push({ x: xStart + slant, y: yMax });
        }
        
        shapes.push({
            id: `${idPrefix}-${i}`,
            type: 'polygon',
            points: pts,
            fill: randomChoice(palette),
            opacity: randomRange(0.05, 0.15), // Subtle layering
            clipPathId: clipId,
            blendMode: 'multiply' // Ensure they blend to create depth
        });
    }
  };

  // Fewer, broader partitions
  addVariation(0, seaY, PALETTE_V2_SKY, 4, 'var-sky', 'cp-sky');
  
  // Sea Perspective: Horizontal bands compressing towards the horizon
  let currentY = seaY;
  let bandCount = 0;
  const maxGroundY = Math.max(groundYLeft, groundYRight);
  
  while (currentY < maxGroundY) {
      const dist = currentY - seaY;
      const bandHeight = 3 + (dist * 0.15) + randomRange(-1, 2);
      
      if (currentY + bandHeight > maxGroundY) break;

      const segments = randomInt(1, 4);
      const segmentWidth = width / segments;

      for (let s = 0; s < segments; s++) {
          const sx = s * segmentWidth;
          const slant = 0; 
          
          shapes.push({
              id: `sea-band-${bandCount}-${s}`,
              type: 'polygon',
              points: [
                  { x: sx, y: currentY }, 
                  { x: sx + segmentWidth, y: currentY }, 
                  { x: sx + segmentWidth + slant, y: currentY + bandHeight },
                  { x: sx + slant, y: currentY + bandHeight }
              ],
              fill: randomChoice(PALETTE_V2_SEA),
              opacity: randomRange(0.3, 0.5), 
              clipPathId: 'cp-sea',
              blendMode: 'multiply'
          });
      }
      
      currentY += bandHeight; 
      bandCount++;
  }

  // Ground Texture: Perspective Facets
  // Tiles/stones that get smaller towards the horizon
  let currentGroundY = height;
  const groundHorizonY = Math.max(groundYLeft, groundYRight);
  let groundRowCount = 0;

  while (currentGroundY > groundHorizonY) {
      const distToHorizon = currentGroundY - groundHorizonY;
      // Row height proportional to distance from horizon (perspective)
      const rowHeight = Math.max(3, distToHorizon * 0.12); 
      
      const nextY = currentGroundY - rowHeight;
      if (nextY < groundHorizonY) break; // Don't cross the horizon

      // Number of columns increases as rows get smaller/further away? 
      // Or just fixed size relative to rowHeight?
      // Let's make tiles roughly square-ish or rectangular
      const tileWidthBase = rowHeight * randomRange(1.2, 2.0);
      const numCols = Math.ceil(width / tileWidthBase) + 2;
      const colWidth = width / numCols;
      
      // Start slightly off-screen to cover edges with jitter
      const startX = -colWidth;

      for (let c = 0; c < numCols + 2; c++) {
          const cx = startX + c * colWidth;
          const jitterX = randomRange(-colWidth * 0.3, colWidth * 0.3);
          const jitterY = randomRange(-rowHeight * 0.1, rowHeight * 0.1);
          
          // Create a trapezoid-ish stone/facet
          shapes.push({
              id: `ground-facet-${groundRowCount}-${c}`,
              type: 'polygon',
              points: [
                  { x: cx + jitterX, y: currentGroundY }, // Bottom Left
                  { x: cx + colWidth + jitterX, y: currentGroundY }, // Bottom Right
                  { x: cx + colWidth + jitterX * 0.8, y: nextY + jitterY }, // Top Right
                  { x: cx + jitterX * 0.8, y: nextY + jitterY }  // Top Left
              ],
              fill: randomChoice(PALETTE_V2_GROUND),
              opacity: randomRange(0.6, 0.9),
              clipPathId: 'cp-ground',
              blendMode: 'normal' 
          });
      }
      currentGroundY = nextY;
      groundRowCount++;
  }


  // 3. Figures
  const numFigures = randomInt(1, 4);
  // Narrower figures: 0.009 (was 0.012)
  const figureWidthBase = width * 0.009; 
  const figureHeightBase = height * 0.09; 
  
  const spawnWaldo = forceWaldo || Math.random() < 0.05; // 5% chance normally

  for (let i = 0; i < (spawnWaldo ? numFigures + 1 : numFigures); i++) {
    // If we are spawning Waldo, make the last figure Waldo
    const isWaldo = spawnWaldo && i === numFigures;
    
    const isMan = isWaldo ? true : Math.random() > 0.45; 
    const posX = randomRange(width * 0.05, width * 0.95);
    
    // Calculate ground Y at figure position
    const t = posX / width;
    const groundYAtPos = groundYLeft * (1-t) + groundYRight * t;
    
    const posY = groundYAtPos + randomRange(5, 35); 
    const facingRight = Math.random() > 0.5;
    const direction = facingRight ? 1 : -1;

    const fWidth = figureWidthBase * randomRange(0.8, 1.1);
    const fHeight = figureHeightBase * randomRange(0.95, 1.15);
    
    const figOpacity = 1.0;
    const figBlend = 'normal';

    if (isWaldo) {
        // WALDO GENERATION
        // Blue Jeans
        shapes.push({
            id: `waldo-legs-${i}`,
            type: 'polygon',
            points: [
                {x: posX - fWidth * 0.5, y: posY},
                {x: posX + fWidth * 0.6, y: posY},
                {x: posX + fWidth * 0.55, y: posY - fHeight * 0.4}, // Waist
                {x: posX - fWidth * 0.45, y: posY - fHeight * 0.4} 
            ],
            fill: "#2e5cb8", // Blue denim
            opacity: figOpacity,
            blendMode: figBlend
        });

        // Striped Shirt (Body)
        const shirtY = posY - fHeight * 0.4;
        const shoulderY = posY - fHeight * 0.88;
        const shirtHeight = shirtY - shoulderY;
        
        // White Base
        shapes.push({
            id: `waldo-shirt-base-${i}`,
            type: 'polygon',
            points: [
                {x: posX - fWidth * 0.45, y: shirtY},
                {x: posX + fWidth * 0.55, y: shirtY},
                {x: posX + fWidth * 0.5, y: shoulderY},
                {x: posX - fWidth * 0.5, y: shoulderY}
            ],
            fill: "#eee",
            opacity: figOpacity,
            blendMode: figBlend
        });

        // Red Stripes
        const numStripes = 5;
        for(let s=0; s<numStripes; s++) {
             const sy = shoulderY + (shirtHeight / numStripes) * s;
             shapes.push({
                id: `waldo-stripe-${i}-${s}`,
                type: 'polygon',
                points: [
                    {x: posX - fWidth * 0.5, y: sy},
                    {x: posX + fWidth * 0.55, y: sy},
                    {x: posX + fWidth * 0.55, y: sy + (shirtHeight/numStripes)*0.5},
                    {x: posX - fWidth * 0.5, y: sy + (shirtHeight/numStripes)*0.5}
                ],
                fill: "#d92b2b",
                opacity: figOpacity,
                blendMode: figBlend
            });
        }

        // Head
        const headY = shoulderY;
        const headSize = fWidth * 0.85;
        shapes.push({
            id: `waldo-head-${i}`,
            type: 'polygon',
            points: [
                {x: posX - headSize/2, y: headY},
                {x: posX + headSize/2, y: headY},
                {x: posX + headSize/2, y: headY - headSize * 1.1},
                {x: posX - headSize/2, y: headY - headSize * 1.1}
            ],
            fill: "#F5DEB3", 
            opacity: figOpacity,
            blendMode: figBlend
        });

        // Beanie (White with Red rim/pom)
        const hatBrimY = headY - headSize * 0.9;
        shapes.push({
            id: `waldo-hat-${i}`,
            type: 'polygon',
            points: [
                {x: posX - headSize * 0.6, y: hatBrimY},
                {x: posX + headSize * 0.6, y: hatBrimY},
                {x: posX + headSize * 0.4, y: hatBrimY - headSize * 0.6},
                {x: posX - headSize * 0.4, y: hatBrimY - headSize * 0.6}
            ],
            fill: "#eee", 
            opacity: figOpacity,
            blendMode: figBlend
        });
        // Red Pom/Rim
        shapes.push({
            id: `waldo-hat-rim-${i}`,
            type: 'polygon',
            points: [
                 {x: posX - headSize * 0.6, y: hatBrimY},
                 {x: posX + headSize * 0.6, y: hatBrimY},
                 {x: posX + headSize * 0.6, y: hatBrimY - 2},
                 {x: posX - headSize * 0.6, y: hatBrimY - 2}
            ],
            fill: "#d92b2b",
            opacity: figOpacity,
            blendMode: figBlend
        });
        
        // Glasses (Simple line/rect)
        shapes.push({
            id: `waldo-glasses-${i}`,
            type: 'polygon',
            points: [
                 {x: posX - headSize * 0.4, y: headY - headSize * 0.6},
                 {x: posX + headSize * 0.4, y: headY - headSize * 0.6},
                 {x: posX + headSize * 0.4, y: headY - headSize * 0.5},
                 {x: posX - headSize * 0.4, y: headY - headSize * 0.5}
            ],
            fill: "#111",
            opacity: 0.8,
            blendMode: figBlend
        });

    } else if (isMan) {
        // Feininger Man: Styles
        const color = randomChoice(PALETTE_V2_SUIT);
        const armStyle = Math.random(); // <0.33: Straight, <0.66: Akimbo (elbow out), else Tight/Crossed

        // 1. Body (Coat) - narrower, more columnar
        shapes.push({
            id: `man-body-${i}`,
            type: 'polygon',
            points: [
                {x: posX - fWidth * 0.5, y: posY}, // Bottom Left
                {x: posX + fWidth * 0.6, y: posY}, // Bottom Right
                {x: posX + fWidth * 0.5, y: posY - fHeight * 0.88}, // Shoulder Right
                {x: posX - fWidth * 0.5, y: posY - fHeight * 0.88}  // Shoulder Left
            ],
            fill: color,
            opacity: figOpacity,
            blendMode: figBlend
        });

        // 2. Arms
        if (armStyle < 0.4) {
            // Straight Down
             shapes.push({
                id: `man-arm-straight-${i}`,
                type: 'polygon',
                points: [
                    {x: posX + (fWidth * 0.5 * direction), y: posY - fHeight * 0.85}, // Shoulder
                    {x: posX + (fWidth * 0.6 * direction), y: posY - fHeight * 0.4},  // Hand
                    {x: posX + (fWidth * 0.3 * direction), y: posY - fHeight * 0.4}   // Inner Wrist
                ],
                fill: color,
                opacity: figOpacity,
                blendMode: figBlend
            });
        } else if (armStyle < 0.7) {
             // Akimbo / Elbow Out (existing but tighter)
             const elbowDir = direction * -1; 
             shapes.push({
                id: `man-arm-akimbo-${i}`,
                type: 'polygon',
                points: [
                    {x: posX + (fWidth * 0.4 * elbowDir), y: posY - fHeight * 0.85}, // Shoulder
                    {x: posX + (fWidth * 1.5 * elbowDir), y: posY - fHeight * 0.6}, // Elbow tip (less wide)
                    {x: posX + (fWidth * 0.5 * elbowDir), y: posY - fHeight * 0.5}  // Hand/Waist
                ],
                fill: color,
                opacity: figOpacity,
                blendMode: figBlend
            });
        } else {
            // Tight / Crossed / Pensive
             shapes.push({
                id: `man-arm-tight-${i}`,
                type: 'polygon',
                points: [
                    {x: posX - fWidth * 0.5, y: posY - fHeight * 0.85}, 
                    {x: posX + fWidth * 0.5, y: posY - fHeight * 0.85}, 
                    {x: posX, y: posY - fHeight * 0.5} 
                ],
                fill: color,
                opacity: figOpacity,
                blendMode: figBlend
            });
        }

        // 3. Head
        const headY = posY - fHeight * 0.88;
        const headSize = fWidth * 0.85;
        shapes.push({
            id: `man-head-${i}`,
            type: 'polygon',
            points: [
                {x: posX - headSize/2, y: headY},
                {x: posX + headSize/2, y: headY},
                {x: posX + headSize/2, y: headY - headSize * 1.1}, // Slightly taller head
                {x: posX - headSize/2, y: headY - headSize * 1.1}
            ],
            fill: "#F5DEB3", 
            opacity: figOpacity,
            blendMode: figBlend
        });

        // 4. Headgear / Hair
        const hasHat = Math.random() < 0.4;
        const hatBrimY = headY - headSize * 0.9;

        if (hasHat) {
            // Under-hat hair
            if (Math.random() < 0.5) {
                const hairColor = randomChoice(["#2F2F2F", "#3E2723", "#5D4037", "#1C1C1C", "#A9A9A9"]);
                const hairRoll = Math.random();
                if (hairRoll < 0.7) {
                    // Sideburns / Peek-a-boo hair
                    shapes.push({
                        id: `man-hair-peek-${i}`,
                        type: 'polygon',
                        points: [
                            {x: posX - headSize * 0.52, y: headY - headSize * 0.5},
                            {x: posX + headSize * 0.52, y: headY - headSize * 0.5},
                            {x: posX + headSize * 0.5, y: headY - headSize * 0.95},
                            {x: posX - headSize * 0.5, y: headY - headSize * 0.95}
                        ],
                        fill: hairColor,
                        opacity: figOpacity,
                        blendMode: figBlend
                    });
                } else {
                    // Long hair peeking out
                    shapes.push({
                        id: `man-hair-long-peek-${i}`,
                        type: 'polygon',
                        points: [
                            {x: posX - headSize * 0.55, y: headY - headSize * 0.2},
                            {x: posX + headSize * 0.55, y: headY - headSize * 0.2},
                            {x: posX + headSize * 0.5, y: headY - headSize * 0.95},
                            {x: posX - headSize * 0.5, y: headY - headSize * 0.95}
                        ],
                        fill: hairColor,
                        opacity: figOpacity,
                        blendMode: figBlend
                    });
                }
            }

            shapes.push({
                id: `man-hat-brim-${i}`,
                type: 'polygon',
                points: [
                    {x: posX - headSize * 1.3, y: hatBrimY},
                    {x: posX + headSize * 1.3, y: hatBrimY},
                    {x: posX + headSize * 1.1, y: hatBrimY - 2},
                    {x: posX - headSize * 1.1, y: hatBrimY - 2}
                ],
                fill: "#111", 
                opacity: figOpacity,
                blendMode: figBlend
            });
            shapes.push({
                id: `man-hat-top-${i}`,
                type: 'polygon',
                points: [
                    {x: posX - headSize * 0.7, y: hatBrimY},
                    {x: posX + headSize * 0.7, y: hatBrimY},
                    {x: posX + headSize * 0.6, y: hatBrimY - headSize * 0.7}, 
                    {x: posX - headSize * 0.8, y: hatBrimY - headSize * 0.7}
                ],
                fill: "#111",
                opacity: figOpacity,
                blendMode: figBlend
            });
        } else {
            // Hair Styles
            const hairRoll = Math.random();
            const hairColor = randomChoice(["#2F2F2F", "#3E2723", "#5D4037", "#1C1C1C", "#A9A9A9"]); // Added Grey
            const hairTopY = headY - headSize * 1.1;

            if (hairRoll < 0.6) {
                // Short Hair (Cap-like on top)
                shapes.push({
                    id: `man-hair-short-${i}`,
                    type: 'polygon',
                    points: [
                        {x: posX - headSize/2, y: headY - headSize * 0.8}, // Sideburn L
                        {x: posX + headSize/2, y: headY - headSize * 0.8}, // Sideburn R
                        {x: posX + headSize/2, y: hairTopY}, // Top R
                        {x: posX - headSize/2, y: hairTopY}, // Top L
                        {x: posX - headSize/2, y: headY - headSize * 0.8}
                    ],
                    fill: hairColor,
                    opacity: figOpacity,
                    blendMode: figBlend
                });
            } else if (hairRoll < 0.75) {
                // Long Hair
                 shapes.push({
                    id: `man-hair-long-${i}`,
                    type: 'polygon',
                    points: [
                        {x: posX - headSize * 0.55, y: headY - headSize * 0.2}, // Bottom L
                        {x: posX + headSize * 0.55, y: headY - headSize * 0.2}, // Bottom R
                        {x: posX + headSize * 0.5, y: hairTopY}, 
                        {x: posX - headSize * 0.5, y: hairTopY}
                    ],
                    fill: hairColor,
                    opacity: figOpacity,
                    blendMode: figBlend
                });
            } else if (hairRoll < 0.90) {
                // Balding (Two side tufts)
                 shapes.push({
                    id: `man-hair-balding-L-${i}`,
                    type: 'polygon',
                    points: [
                        {x: posX - headSize/2, y: headY - headSize * 0.7},
                        {x: posX - headSize * 0.2, y: headY - headSize * 0.7},
                        {x: posX - headSize * 0.2, y: headY - headSize * 1.0},
                        {x: posX - headSize/2, y: headY - headSize * 0.9}
                    ],
                    fill: hairColor,
                    opacity: figOpacity,
                    blendMode: figBlend
                });
                shapes.push({
                    id: `man-hair-balding-R-${i}`,
                    type: 'polygon',
                    points: [
                        {x: posX + headSize/2, y: headY - headSize * 0.7},
                        {x: posX + headSize * 0.2, y: headY - headSize * 0.7},
                        {x: posX + headSize * 0.2, y: headY - headSize * 1.0},
                        {x: posX + headSize/2, y: headY - headSize * 0.9}
                    ],
                    fill: hairColor,
                    opacity: figOpacity,
                    blendMode: figBlend
                });
            } else {
                // Bald (Do nothing, or add a shine/highlight?)
                // Maybe a slight highlight on top
                shapes.push({
                    id: `man-bald-shine-${i}`,
                    type: 'polygon',
                    points: [
                        {x: posX - headSize * 0.2, y: hairTopY + headSize * 0.1},
                        {x: posX + headSize * 0.2, y: hairTopY + headSize * 0.1},
                        {x: posX + headSize * 0.1, y: hairTopY + headSize * 0.2},
                        {x: posX - headSize * 0.1, y: hairTopY + headSize * 0.2}
                    ],
                    fill: "#FFF",
                    opacity: 0.3,
                    blendMode: figBlend
                });
            }
        }

    } else {
        // Woman: Styles
        const dressColor = randomChoice(PALETTE_V2_SUNDRESS);
        const topStyle = Math.random(); // <0.33: Shawl, <0.66: Cape, Else: Bodice
        
        // 1. Dress (Main triangle, narrower)
        shapes.push({
            id: `woman-dress-${i}`,
            type: 'polygon',
            points: [
                {x: posX, y: posY - fHeight * 0.85}, // Neck
                {x: posX + fWidth * 1.4, y: posY}, // Bottom Right flare (less wide)
                {x: posX - fWidth * 1.3, y: posY}  // Bottom Left flare
            ],
            fill: dressColor,
            opacity: figOpacity,
            blendMode: figBlend
        });

        // 2. Top / Shawl
        const shawlColor = randomChoice(PALETTE_V2_SEA);
        
        if (topStyle < 0.4) {
            // Classic Shawl
             shapes.push({
                id: `woman-shawl-${i}`,
                type: 'polygon',
                points: [
                    {x: posX, y: posY - fHeight * 0.85}, 
                    {x: posX + fWidth * 1.1, y: posY - fHeight * 0.55}, 
                    {x: posX, y: posY - fHeight * 0.45},
                    {x: posX - fWidth * 1.1, y: posY - fHeight * 0.55}
                ],
                fill: shawlColor,
                opacity: 0.9,
                blendMode: figBlend
            });
        } else if (topStyle < 0.7) {
             // Cape (Back heavy)
             shapes.push({
                id: `woman-cape-${i}`,
                type: 'polygon',
                points: [
                    {x: posX - fWidth * 0.6, y: posY - fHeight * 0.85}, // Left Shoulder
                    {x: posX + fWidth * 0.6, y: posY - fHeight * 0.85}, // Right Shoulder
                    {x: posX + fWidth * 1.3, y: posY - fHeight * 0.3}, // Cape tip R
                    {x: posX - fWidth * 1.3, y: posY - fHeight * 0.3}  // Cape tip L
                ],
                fill: shawlColor,
                opacity: 0.9,
                blendMode: figBlend
            });
        } else {
            // Tight Bodice
             shapes.push({
                id: `woman-bodice-${i}`,
                type: 'polygon',
                points: [
                    {x: posX - fWidth * 0.5, y: posY - fHeight * 0.85}, 
                    {x: posX + fWidth * 0.5, y: posY - fHeight * 0.85}, 
                    {x: posX + fWidth * 0.3, y: posY - fHeight * 0.5},
                    {x: posX - fWidth * 0.3, y: posY - fHeight * 0.5}
                ],
                fill: shawlColor,
                opacity: 0.9,
                blendMode: figBlend
            });
        }

        // 3. Head
        const headSize = fWidth * 0.75;
        const headY = posY - fHeight * 0.85;
        shapes.push({
            id: `woman-head-${i}`,
            type: 'polygon',
            points: [
                {x: posX - headSize/2, y: headY},
                {x: posX + headSize/2, y: headY},
                {x: posX + headSize/2, y: headY - headSize},
                {x: posX - headSize/2, y: headY - headSize}
            ],
            fill: "#F5DEB3",
            opacity: figOpacity,
            blendMode: figBlend
        });
    }
  }

  // 4. Overarching Light Shards (Unifying Elements - NO CLIP, they cut through everything)
  const numBeams = randomInt(3, 6);
  for (let i = 0; i < numBeams; i++) {
     const x1 = randomRange(0, width);
     const y1 = randomRange(0, height); 
     
     const pts: Point[] = [
         {x: x1, y: y1},
         {x: x1 + randomRange(-300, 300), y: height}, 
         {x: x1 + randomRange(-100, 100) + 50, y: height}
     ];
     
     shapes.push({
         id: `global-beam-${i}`,
         type: 'polygon',
         points: pts,
         fill: "#F0F8FF", 
         opacity: 0.05 + randomRange(0, 0.1) 
     });
  }

  
    return { width, height, shapes, horizonY, version: 'v2', regions, seed };
  }
  
  const PALETTE_CALM_DAY_SAILS = [
  "#ffffff", "#d6cead", "#9ea4ab", "#8d9499", "#e0e3e6", // Whites/Greys
  "#210e17", "#4a1529", // Plums
  "#c4281f", "#f04929", "#69100d", // Reds
  "#f7982a", "#d94a11", "#facc43"  // Oranges/Golds
];

const PALETTE_CALM_DAY_HULLS = ["#2b2621", "#453d36", "#120504", "#2e0f0c", "#000000"];

function generateBoatShapes(idPrefix: string, x: number, y: number, scale: number, horizonY: number): Shape[] {
  const shapes: Shape[] = [];
  const numSails = randomInt(1, 4);
  const hullWidth = 100 * scale;
  const hullHeight = 20 * scale;
  const hullColor = randomChoice(PALETTE_CALM_DAY_HULLS);

  // 1. Hull
  shapes.push({
    id: `${idPrefix}-hull-1`,
    type: 'polygon',
    points: [
      { x: x - hullWidth * 0.5, y: y },
      { x: x + hullWidth * 0.6, y: y },
      { x: x + hullWidth * 0.4, y: y + hullHeight },
      { x: x - hullWidth * 0.3, y: y + hullHeight }
    ],
    fill: hullColor,
    opacity: 1
  });

  shapes.push({
    id: `${idPrefix}-hull-2`,
    type: 'polygon',
    points: [
      { x: x - hullWidth * 0.5, y: y },
      { x: x + hullWidth * 0.1, y: y + hullHeight * 0.5 },
      { x: x - hullWidth * 0.1, y: y + hullHeight * 1.2 },
      { x: x - hullWidth * 0.3, y: y + hullHeight }
    ],
    fill: randomChoice(PALETTE_CALM_DAY_HULLS),
    opacity: 0.8
  });

  // 2. Sails
  for (let i = 0; i < numSails; i++) {
    const sailWidth = randomRange(40, 100) * scale;
    const sailHeight = randomRange(100, 400) * scale;
    const sailX = x + randomRange(-hullWidth * 0.3, hullWidth * 0.3);
    const sailTopX = sailX + randomRange(-sailWidth, sailWidth);
    const sailColor = randomChoice(PALETTE_CALM_DAY_SAILS);

    shapes.push({
      id: `${idPrefix}-sail-${i}`,
      type: 'polygon',
      points: [
        { x: sailX - sailWidth * 0.5, y: y },
        { x: sailX + sailWidth * 0.5, y: y },
        { x: sailTopX, y: y - sailHeight }
      ],
      fill: sailColor,
      opacity: randomRange(0.8, 1)
    });

    // Sub-sail or shadow plane
    if (Math.random() > 0.5) {
      shapes.push({
        id: `${idPrefix}-sail-${i}-shadow`,
        type: 'polygon',
        points: [
          { x: sailTopX, y: y - sailHeight },
          { x: sailX + sailWidth * 0.7, y: y },
          { x: sailX + sailWidth * 0.5, y: y }
        ],
        fill: randomChoice(PALETTE_CALM_DAY_SAILS),
        opacity: 0.9
      });
    }
  }

  // 3. Reflections
  const reflectionColor = randomChoice(PALETTE_CALM_DAY_SAILS);
  shapes.push({
    id: `${idPrefix}-reflection-1`,
    type: 'polygon',
    points: [
      { x: x - hullWidth * 0.4, y: y + hullHeight },
      { x: x + hullWidth * 0.5, y: y + hullHeight },
      { x: x + hullWidth * 0.3, y: y + hullHeight * 6 },
      { x: x - hullWidth * 0.1, y: y + hullHeight * 5 }
    ],
    fill: reflectionColor,
    opacity: 0.25,
    blendMode: 'overlay'
  });

  return shapes;
}

export function generateFeiningerV3(width: number, height: number): FeiningerData {
  const shapes: Shape[] = [];
  const horizonY = 900; // Fixed for this style's coordinates
  const seed = randomInt(1, 1000);

  // Background Prisms (simplified versions of the reference)
  shapes.push({
    id: 'bg-left',
    type: 'polygon',
    points: [{x: 0, y: 0}, {x: 600, y: 0}, {x: 350, y: 900}, {x: 0, y: 900}],
    fill: "#141f33", // Simplified sky-blue
    opacity: 1
  });
  shapes.push({
    id: 'bg-right',
    type: 'polygon',
    points: [{x: 600, y: 0}, {x: 800, y: 0}, {x: 800, y: 900}, {x: 350, y: 900}],
    fill: "#e8a825", // Simplified sky-gold
    opacity: 1
  });

  // Sea Base
  shapes.push({
    id: 'sea-base-left',
    type: 'polygon',
    points: [{x: 0, y: 900}, {x: 450, y: 900}, {x: 400, y: 1200}, {x: 0, y: 1200}],
    fill: "#3d5452",
    opacity: 1
  });
  shapes.push({
    id: 'sea-base-right',
    type: 'polygon',
    points: [{x: 450, y: 900}, {x: 800, y: 900}, {x: 800, y: 1200}, {x: 400, y: 1200}],
    fill: "#ad7121",
    opacity: 1
  });

  // Sky Shards
  const skyPalette = ["#18273d", "#335675", "#20334a", "#fad155", "#e08e1b", "#bf4c13"];
  for (let i = 0; i < 8; i++) {
    shapes.push({
      id: `sky-shard-${i}`,
      type: 'polygon',
      points: [
        { x: randomRange(0, 800), y: 0 },
        { x: randomRange(0, 800), y: 0 },
        { x: randomRange(0, 800), y: 900 },
        { x: randomRange(0, 800), y: 900 }
      ],
      fill: randomChoice(skyPalette),
      opacity: randomRange(0.3, 0.7),
      blendMode: Math.random() > 0.5 ? 'overlay' : 'multiply'
    });
  }

  // Generate 3 boats at different depths
  shapes.push(...generateBoatShapes('distant-boat', 440, 900, 0.3, horizonY));
  shapes.push(...generateBoatShapes('left-boat', 230, 900, 0.8, horizonY));
  shapes.push(...generateBoatShapes('right-boat', 650, 910, 1.1, horizonY));

  // Prismatic Rays
  for (let i = 0; i < 4; i++) {
    shapes.push({
      id: `ray-${i}`,
      type: 'polygon',
      points: [
        { x: randomRange(-200, 800), y: -100 },
        { x: randomRange(0, 1000), y: 1200 },
        { x: randomRange(0, 1000), y: 1200 },
        { x: randomRange(-200, 800), y: -100 }
      ],
      fill: Math.random() > 0.5 ? "#ffffff" : "#000000",
      opacity: randomRange(0.05, 0.15),
      blendMode: Math.random() > 0.5 ? 'overlay' : 'multiply'
    });
  }

  return { width: 800, height: 1200, shapes, horizonY, version: 'v3', seed };
}

export function generateFeiningerGemini3(width: number, height: number): FeiningerData {
  return {
    width: 800,
    height: 1200,
    shapes: [],
    horizonY: 900,
    version: 'gemini3',
    seed: 0
  };
}


  