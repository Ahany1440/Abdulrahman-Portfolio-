/**
 * Particle field data and shaders for the hero.
 * Every particle has a target (a point inside the rendered name), a start position (a loose swirl),
 * and a field position (where it ends up once the name breaks apart on scroll).
 * All motion happens in the vertex shader; JS only updates a handful of uniforms.
 */

export type ParticleData = {
  count: number;
  target: Float32Array;
  start: Float32Array;
  field: Float32Array;
  rand: Float32Array;
  /** Width / height of the sampled text block, in normalised units (width = 1). */
  aspect: number;
};

/** Draws the lines of text to an offscreen canvas and returns the filled pixel coordinates. */
function sampleText(lines: string[], fontFamily: string, weight = 700) {
  const W = 1600;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2d canvas unavailable");

  // Size the font so the longest line fills the canvas width.
  let fontSize = 200;
  ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
  const longest = Math.max(...lines.map((l) => ctx.measureText(l).width));
  fontSize = Math.floor((fontSize * (W * 0.98)) / longest);
  const lineHeight = fontSize * 0.92;
  const H = Math.ceil(lineHeight * lines.length + fontSize * 0.2);

  canvas.width = W;
  canvas.height = H;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
  // Tight tracking, like the display type on the page.
  if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-fontSize * 0.02}px`;
  lines.forEach((line, i) => ctx.fillText(line, W / 2, fontSize * 0.86 + i * lineHeight));

  const { data } = ctx.getImageData(0, 0, W, H);
  const pts: number[] = [];
  const step = 2;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y * W + x) * 4 + 3] > 140) pts.push(x, y);
    }
  }
  return { pts, W, H };
}

/** Deterministic PRNG so the field looks the same on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildParticles(lines: string[], fontFamily: string, count: number): ParticleData {
  const { pts, W, H } = sampleText(lines, fontFamily);
  const rnd = mulberry32(1107);
  const target = new Float32Array(count * 3);
  const start = new Float32Array(count * 3);
  const field = new Float32Array(count * 3);
  const rand = new Float32Array(count * 4);
  const nPts = pts.length / 2;
  const dustShare = 0.1;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const dust = rnd() < dustShare;
    if (dust || nPts === 0) {
      // Ambient dust drifting around the name.
      target[i3] = (rnd() - 0.5) * 2.2;
      target[i3 + 1] = (rnd() - 0.5) * 1.4;
      target[i3 + 2] = (rnd() - 0.5) * 1.6 - 0.4;
    } else {
      const p = Math.floor(rnd() * nPts) * 2;
      // Normalise so the text block is 1 unit wide and centred on the origin.
      target[i3] = (pts[p] + rnd() * 2 - W / 2) / W;
      target[i3 + 1] = -(pts[p + 1] + rnd() * 2 - H / 2) / W;
      target[i3 + 2] = (rnd() - 0.5) * 0.02;
    }

    // Start: a flattened galaxy swirl around the origin.
    const r = 2.5 + Math.pow(rnd(), 0.6) * 7;
    const a = rnd() * Math.PI * 2;
    start[i3] = Math.cos(a) * r;
    start[i3 + 1] = (rnd() - 0.5) * 2.4;
    start[i3 + 2] = Math.sin(a) * r * 0.45 - 2.5;

    // Field: a deep starfield behind and around the camera path.
    field[i3] = (rnd() - 0.5) * 26;
    field[i3 + 1] = (rnd() - 0.5) * 16;
    field[i3 + 2] = -rnd() * 26 + 4;

    rand[i * 4] = rnd();
    rand[i * 4 + 1] = rnd();
    rand[i * 4 + 2] = rnd();
    rand[i * 4 + 3] = rnd();
  }
  return { count, target, start, field, rand, aspect: H / W };
}

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uScatter;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uScale;
  uniform float uOffsetY;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform float uMouseRadius;

  attribute vec3 aTarget;
  attribute vec3 aStart;
  attribute vec3 aField;
  attribute vec4 aRand;

  varying float vAlpha;
  varying float vHeat;

  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }

  void main() {
    // Intro: each particle leaves the swirl with its own delay, so the name assembles in waves.
    float delay = aRand.x * 0.4;
    float t = clamp((uIntro - delay) / 0.6, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - t, 4.0);

    vec3 swirl = rotY(aStart, (1.0 - e) * (5.0 + aRand.y * 5.0) + uTime * 0.08);
    vec3 home = vec3(aTarget.xy * uScale, aTarget.z * uScale) + vec3(0.0, uOffsetY, 0.0);
    home += vec3(
      sin(uTime * 0.7 + aRand.z * 6.2831),
      cos(uTime * 0.6 + aRand.w * 6.2831),
      sin(uTime * 0.5 + aRand.y * 6.2831)
    ) * 0.008 * uScale;
    vec3 pos = mix(swirl, home, e);

    // Magnetic push away from the cursor, with a soft gaussian falloff.
    vec2 d = pos.xy - uMouse.xy;
    float f = exp(-dot(d, d) / (uMouseRadius * uMouseRadius)) * uMouseStrength * e;
    pos.xy += normalize(d + vec2(1e-4)) * f * (0.35 + aRand.z * 0.45);
    pos.z += f * (aRand.w - 0.2) * 0.9;

    // Scroll out: the name tears apart, streams toward the camera, then settles into a starfield.
    float s = smoothstep(aRand.y * 0.35, 0.65 + aRand.y * 0.35, uScatter);
    vec3 field = rotY(aField, uTime * 0.015);
    vec3 toward = vec3((aRand.x - 0.5) * 2.4, (aRand.z - 0.5) * 1.6, 2.6 + aRand.w * 3.4);
    float arc = sin(3.14159 * s);
    pos = mix(pos, field, s) + toward * arc;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.55 + aRand.w * 0.9) * (1.0 + arc * 0.6);
    gl_PointSize = size * uPixelRatio / max(0.5, -mv.z);

    vAlpha = mix(0.25, 1.0, e) * mix(1.0, 0.35 + aRand.x * 0.45, s) * (1.0 - arc * 0.45);
    vAlpha *= smoothstep(1.0, 3.5, -mv.z);
    vHeat = clamp(f * 2.2, 0.0, 1.0) + step(0.985, aRand.y) * 0.6;
  }
`;

export const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    vec3 col = mix(uColor, uHot, vHeat);
    gl_FragColor = vec4(col, a * vAlpha);
  }
`;
