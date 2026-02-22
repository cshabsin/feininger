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
  y?: number;
  height?: number;
  points?: Point[];
}

export interface V3Config {
  bgLeft: string;
  bgRight: string;
  seaLeft: string;
  seaRight: string;
  rocks: { id: string, x: number, w: number, y: number, skew: number, color: string, blend: string }[];
  boats: { id: string, x: number, y: number, scale: number, sails: { w: number, h: number, x: number, tx: number, color: string }[], hullColor: string }[];
  rays: { id: string, points: Point[], color: string, opacity: number, blend: string }[];
}

export interface FeiningerData {
  width: number;
  height: number;
  shapes: Shape[];
  horizonY: number;
  version: 'prismatic-sails' | 'the-watchers' | 'calm-day-n-plus-1' | 'calm-day-at-sea-ii' | 'calm-day-at-sea-iii';
  regions?: Region[];
  seed: number;
  config?: V3Config;
}

const PALETTE_V1 = ["#708090", "#778899", "#B0C4DE", "#4682B4", "#5F9EA0", "#D2B48C", "#F5DEB3", "#F0F8FF", "#E0FFFF", "#D3D3D3", "#2F4F4F"];
const PALETTE_V2_SKY = ["#A9A9A9", "#778899", "#D3D3D3", "#F0F8FF"];
const PALETTE_V2_SEA = ["#1E3F5A", "#4682B4", "#5F9EA0", "#2F4F4F"];
const PALETTE_V2_GROUND = ["#2F2F2F", "#363636", "#3E3E3E", "#424242", "#483C32", "#3E2723"];
const PALETTE_V2_SUNDRESS = ["#CD5C5C", "#DAA520", "#20B2AA", "#D8BFD8", "#F4A460"];
const PALETTE_V2_SUIT = ["#000000", "#2F2F2F", "#3E2723", "#1C1C1C", "#5D4037", "#4E342E", "#795548"];
const PALETTE_CALM_DAY_SAILS = ["#ffffff", "#d6cead", "#9ea4ab", "#8d9499", "#e0e3e6", "#210e17", "#4a1529", "#c4281f", "#f04929", "#69100d", "#f7982a", "#d94a11", "#facc43"];
const PALETTE_CALM_DAY_HULLS = ["#2b2621", "#453d36", "#120504", "#2e0f0c", "#000000"];

function randomRange(min: number, max: number): number { return Math.random() * (max - min) + min; }
function randomInt(min: number, max: number): number { return Math.floor(randomRange(min, max)); }
function randomChoice<T>(arr: T[]): T { return arr[randomInt(0, arr.length)]; }

export function generateFeiningerV1(width: number, height: number): FeiningerData {
  const shapes: Shape[] = [];
  const horizonY = height * 0.66;
  const seed = randomInt(1, 1000);
  shapes.push({ id: 'sky', type: 'polygon', points: [{x: 0, y: 0}, {x: width, y: 0}, {x: width, y: horizonY}, {x: 0, y: horizonY}], fill: "#E0FFFF", opacity: 0.3 });
  shapes.push({ id: 'sea', type: 'polygon', points: [{x: 0, y: horizonY}, {x: width, y: horizonY}, {x: width, y: height}, {x: 0, y: height}], fill: "#708090", opacity: 0.3 });
  const numSails = randomInt(5, 12);
  for (let i = 0; i < numSails; i++) {
    const baseX = randomRange(width * 0.1, width * 0.9);
    const sw = randomRange(width * 0.02, width * 0.08);
    const sh = randomRange(height * 0.2, height * 0.5);
    const tx = baseX + randomRange(-sw, sw) * 2;
    const ty = horizonY - sh;
    const color = randomChoice(PALETTE_V1);
    const op = randomRange(0.2, 0.5);
    shapes.push({ id: `sail-${i}`, type: 'polygon', points: [{ x: baseX - sw / 2, y: horizonY }, { x: baseX + sw / 2, y: horizonY }, { x: tx, y: ty }], fill: color, opacity: op });
    shapes.push({ id: `refl-${i}`, type: 'polygon', points: [{ x: baseX - sw / 2, y: horizonY }, { x: baseX + sw / 2, y: horizonY }, { x: tx + randomRange(-10, 10), y: horizonY + sh * randomRange(0.8, 1.2) }], fill: color, opacity: op * 0.6 });
  }
  return { width, height, shapes, horizonY, version: 'prismatic-sails', seed };
}

export function generateFeiningerV2(width: number, height: number, forceWaldo: boolean = false): FeiningerData {
  const shapes: Shape[] = [];
  const seed = randomInt(1, 1000);
  const groundBaseH = height * 0.12;
  const skew = randomRange(-height * 0.05, height * 0.05);
  const gyL = (height - groundBaseH) + skew;
  const gyR = (height - groundBaseH) - skew;
  const seaY = Math.min(gyL, gyR) - height * 0.22;
  const regions: Region[] = [
    { id: 'cp-sky', points: [{x:0, y:0}, {x:width, y:0}, {x:width, y:seaY}, {x:0, y:seaY}] },
    { id: 'cp-sea', points: [{x:0, y:seaY}, {x:width, y:seaY}, {x:width, y:gyR}, {x:0, y:gyL}] },
    { id: 'cp-ground', points: [{x:0, y:gyL}, {x:width, y:gyR}, {x:width, y:height}, {x:0, y:height}] }
  ];
  shapes.push({ id: 'base-sky', type: 'polygon', points: [{x: 0, y: 0}, {x: width, y: 0}, {x: width, y: seaY}, {x: 0, y: seaY}], fill: "#D3D3D3", opacity: 0.5 });
  shapes.push({ id: 'base-sea', type: 'polygon', points: [{x: 0, y: seaY}, {x: width, y: seaY}, {x: width, y: gyR}, {x: 0, y: gyL}], fill: "#4682B4", opacity: 0.6 });
  shapes.push({ id: 'base-ground', type: 'polygon', points: [{x: 0, y: gyL}, {x: width, y: gyR}, {x: width, y: height}, {x: 0, y: height}], fill: "#1A1A1A", opacity: 0.9 });
  return { width, height, shapes, horizonY: seaY, version: 'the-watchers', regions, seed };
}

export function generateV3Config(): V3Config {
  const skyPaletteCool = ["#18273d", "#335675", "#20334a", "#4e6f8a", "#132338"];
  const skyPaletteWarm = ["#fad155", "#e08e1b", "#bf4c13", "#f7cd59", "#d49333"];
  const config: V3Config = { bgLeft: "#141f33", bgRight: "#e8a825", seaLeft: "#3d5452", seaRight: "#ad7121", rocks: [], boats: [], rays: [] };
  for (let i = 0; i < randomInt(4, 7); i++) {
    config.rocks.push({ id: `rock-left-${i}`, x: randomRange(0, 400), w: randomRange(100, 300), y: randomRange(0, 400), skew: randomRange(-100, 100), color: randomChoice(skyPaletteCool), blend: Math.random() > 0.3 ? 'multiply' : 'normal' });
  }
  for (let i = 0; i < randomInt(4, 7); i++) {
    config.rocks.push({ id: `rock-right-${i}`, x: randomRange(400, 800), w: randomRange(100, 300), y: randomRange(0, 400), skew: randomRange(-100, 100), color: randomChoice(skyPaletteWarm), blend: Math.random() > 0.3 ? 'overlay' : 'normal' });
  }
  const boatSpecs = [{ id: 'distant-boat', x: 440, y: 900, s: 0.3 }, { id: 'left-boat', x: 230, y: 900, s: 0.8 }, { id: 'right-boat', x: 650, y: 910, s: 1.1 }];
  if (Math.random() < 0.8) boatSpecs.push({ id: 'foreground-boat', x: randomRange(100, 700), y: 950, s: 1.8 });
  for (const spec of boatSpecs) {
    const sails = [];
    for (let i = 0; i < randomInt(1, 4); i++) {
      sails.push({ w: randomRange(40, 100) * spec.s, h: randomRange(100, 400) * spec.s, x: spec.x + randomRange(-30 * spec.s, 30 * spec.s), tx: spec.x + randomRange(-100 * spec.s, 100 * spec.s), color: randomChoice(PALETTE_CALM_DAY_SAILS) });
    }
    config.boats.push({ id: spec.id, x: spec.x, y: spec.y, scale: spec.s, hullColor: randomChoice(PALETTE_CALM_DAY_HULLS), sails });
  }
  for (let i = 0; i < 4; i++) {
    config.rays.push({ id: `ray-${i}`, points: [{ x: randomRange(-200, 800), y: -100 }, { x: randomRange(0, 1000), y: 1200 }, { x: randomRange(0, 1000), y: 1200 }, { x: randomRange(-200, 800), y: -100 }], color: Math.random() > 0.5 ? "#ffffff" : "#000000", opacity: randomRange(0.05, 0.15), blend: Math.random() > 0.5 ? 'overlay' : 'multiply' });
  }
  return config;
}

export function renderV3FromConfig(config: V3Config): Shape[] {
  const shapes: Shape[] = [];
  shapes.push({ id: 'bg-left', type: 'polygon', fill: config.bgLeft, opacity: 1, points: [{x: 0, y: 0}, {x: 600, y: 0}, {x: 350, y: 900}, {x: 0, y: 900}] });
  shapes.push({ id: 'bg-right', type: 'polygon', fill: config.bgRight, opacity: 1, points: [{x: 600, y: 0}, {x: 800, y: 0}, {x: 800, y: 900}, {x: 350, y: 900}] });
  shapes.push({ id: 'sea-base-left', type: 'polygon', fill: config.seaLeft, opacity: 1, points: [{x: 0, y: 900}, {x: 450, y: 900}, {x: 400, y: 1200}, {x: 0, y: 1200}] });
  shapes.push({ id: 'sea-base-right', type: 'polygon', fill: config.seaRight, opacity: 1, points: [{x: 450, y: 900}, {x: 800, y: 900}, {x: 800, y: 1200}, {x: 400, y: 1200}] });
  for (const r of config.rocks) {
    shapes.push({ id: r.id, type: 'polygon', fill: r.color, opacity: 0.6, blendMode: r.blend as any, points: [{ x: r.x, y: r.y }, { x: r.x + r.w * 0.5, y: r.y * 0.5 }, { x: r.x + r.w, y: r.y }, { x: r.x + r.w + r.skew, y: 900 }, { x: r.x + r.skew, y: 900 }] });
  }
  for (const b of config.boats) {
    const hw = 100 * b.scale, hh = 20 * b.scale;
    shapes.push({ id: `${b.id}-hull`, type: 'polygon', fill: b.hullColor, opacity: 1, points: [{ x: b.x - hw * 0.5, y: b.y }, { x: b.x + hw * 0.6, y: b.y }, { x: b.x + hw * 0.4, y: b.y + hh }, { x: b.x - hw * 0.3, y: b.y + hh }] });
    for (const [i, s] of b.sails.entries()) {
      shapes.push({ id: `${b.id}-sail-${i}`, type: 'polygon', fill: s.color, opacity: 0.9, points: [{ x: s.x - s.w * 0.5, y: b.y }, { x: s.x + s.w * 0.5, y: b.y }, { x: s.tx, y: b.y - s.h }] });
    }
    shapes.push({ id: `${b.id}-refl`, type: 'polygon', fill: b.hullColor, opacity: 0.15, blendMode: 'overlay', points: [{ x: b.x - hw * 0.4, y: b.y + hh }, { x: b.x + hw * 0.5, y: b.y + hh }, { x: b.x + hw * 0.3, y: b.y + hh * 6 }, { x: b.x - hw * 0.1, y: b.y + hh * 5 }] });
  }
  for (const r of config.rays) { shapes.push({ id: r.id, type: 'polygon', points: r.points, fill: r.color, opacity: r.opacity, blendMode: r.blend as any }); }
  return shapes;
}

export function generateFeiningerV3(width: number, height: number, existingConfig?: V3Config): FeiningerData {
  const config = existingConfig || generateV3Config();
  const shapes = renderV3FromConfig(config);
  return { width: 800, height: 1200, shapes, horizonY: 900, version: 'calm-day-n-plus-1', seed: Math.random(), config };
}

export function generateFeiningerGemini2(width: number, height: number): FeiningerData { return { width: 1000, height: 562, shapes: [], horizonY: 400, version: 'calm-day-at-sea-ii', seed: 0 }; }
export function generateFeiningerGemini3(width: number, height: number): FeiningerData { return { width: 800, height: 1200, shapes: [], horizonY: 900, version: 'calm-day-at-sea-iii', seed: 0 }; }
