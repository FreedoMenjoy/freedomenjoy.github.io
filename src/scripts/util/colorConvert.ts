import { type HSLColor, type HSVColor, type RGBColor } from './color';

export function RGBtoHSL (rgb: RGBColor): HSLColor {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  if (r === max) return [((g - b) / d + (g < b ? 6 : 0)) / 6, s, l];
  if (g === max) return [((b - r) / d + 2) / 6, s, l];
  else return [((r - g) / d + 4) / 6, s, l];
}

const oneSixth = 1 / 6;
const oneHalf = 1 / 2;
const oneThird = 1 / 3;
const twoThirds = 2 / 3;

function hue2rgb (p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  else if (t > 1) t -= 1;

  if (t < oneSixth) return p + (q - p) * 6 * t;
  if (t < oneHalf) return q;
  if (t < twoThirds) return p + (q - p) * (twoThirds - t) * 6;
  return p;
}

export function HSLtoRGB (hsl: HSLColor): RGBColor {
  const h = hsl[0];
  const s = hsl[1];
  const l = hsl[2];

  if (s === 0) return [255, 255, 255];

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return [hue2rgb(p, q, h + oneThird) * 255, hue2rgb(p, q, h) * 255, hue2rgb(p, q, h - oneThird) * 255];
}

export function RGBtoHSV (rgb: RGBColor): HSVColor {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max;

  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max === min) return [0, s, v];

  if (r === max) return [((g - b) / d + (g < b ? 6 : 0)) / 6, s, v];
  if (g === max) return [((b - r) / d + 2) / 6, s, v];
  else return [((r - g) / d + 4) / 6, s, v];
}

export function HSVtoRGB (hsv: HSVColor): RGBColor {
  const h = hsv[0];
  const s = hsv[1];
  const v = hsv[2];

  const i = Math.floor(h * 6) % 6;
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i) {
    case 0: return [v * 255, t * 255, p * 255];
    case 1: return [q * 255, v * 255, p * 255];
    case 2: return [p * 255, v * 255, t * 255];
    case 3: return [p * 255, q * 255, v * 255];
    case 4: return [t * 255, p * 255, v * 255];
    case 5: return [v * 255, p * 255, q * 255];
  }
  throw new Error('Unexpected error');
}

export class ColorConvertable {
  private readonly _rgb: RGBColor;

  private constructor (rgb: RGBColor) {
    this._rgb = Array.from(rgb) as RGBColor;
  }

  public static fromRGB (rgb: RGBColor): ColorConvertable {
    return new ColorConvertable(rgb);
  }

  public static fromHSL (hsl: HSLColor): ColorConvertable {
    return new ColorConvertable(HSLtoRGB(hsl));
  }

  public static fromHSV (hsv: HSVColor): ColorConvertable {
    return new ColorConvertable(HSVtoRGB(hsv));
  }

  public get rgb (): RGBColor {
    return Array.from(this._rgb) as RGBColor;
  }

  public get hsl (): HSVColor {
    return RGBtoHSL(this._rgb);
  }

  public get hsv (): HSLColor {
    return RGBtoHSL(this._rgb);
  }
}
