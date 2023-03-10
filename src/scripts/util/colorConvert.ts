import { type LABColor, type HSLColor, type HSVColor, type RGBColor } from './color';

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

export function RGBtoLAB (rgb: RGBColor): LABColor {
  const _r = rgb[0] / 255;
  const _g = rgb[1] / 255;
  const _b = rgb[2] / 255;

  const r = (_r > 0.04045) ? Math.pow((_r + 0.055) / 1.055, 2.4) : _r / 12.92;
  const g = (_g > 0.04045) ? Math.pow((_g + 0.055) / 1.055, 2.4) : _g / 12.92;
  const b = (_b > 0.04045) ? Math.pow((_b + 0.055) / 1.055, 2.4) : _b / 12.92;

  const _x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const _y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  const _z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  const x = (_x > 0.008856) ? Math.pow(_x, 1 / 3) : (7.787 * _x) + 16 / 116;
  const y = (_y > 0.008856) ? Math.pow(_y, 1 / 3) : (7.787 * _y) + 16 / 116;
  const z = (_z > 0.008856) ? Math.pow(_z, 1 / 3) : (7.787 * _z) + 16 / 116;

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
}

export function LABtoRGB (lab: LABColor): RGBColor {
  const _y = (lab[0] + 16) / 116;
  const _x = lab[1] / 500 + _y;
  const _z = _y - lab[2] / 200;

  const _x3 = _x * _x * _x;
  const _y3 = _y * _y * _y;
  const _z3 = _z * _z * _z;

  const x = 0.95047 * ((_x3 > 0.008856) ? _x3 : (_x - 16 / 116) / 7.787);
  const y = 1.00000 * ((_y3 > 0.008856) ? _y3 : (_y - 16 / 116) / 7.787);
  const z = 1.08883 * ((_z3 > 0.008856) ? _z3 : (_z - 16 / 116) / 7.787);

  const _r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  const _g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  const _b = x * 0.0557 + y * -0.2040 + z * 1.0570;

  const r = (_r > 0.0031308) ? (1.055 * Math.pow(_r, 1 / 2.4) - 0.055) : 12.92 * _r;
  const g = (_g > 0.0031308) ? (1.055 * Math.pow(_g, 1 / 2.4) - 0.055) : 12.92 * _g;
  const b = (_b > 0.0031308) ? (1.055 * Math.pow(_b, 1 / 2.4) - 0.055) : 12.92 * _b;

  return [Math.max(0, Math.min(1, r)) * 255,
    Math.max(0, Math.min(1, g)) * 255,
    Math.max(0, Math.min(1, b)) * 255];
}

export class ColorConvertable {
  private readonly _rgb: RGBColor;

  private constructor (rgb: RGBColor) {
    this._rgb = rgb;
  }

  public static fromRGB (rgb: RGBColor): ColorConvertable {
    return new ColorConvertable(Array.from(rgb) as RGBColor);
  }

  public static fromHSL (hsl: HSLColor): ColorConvertable {
    return new ColorConvertable(HSLtoRGB(hsl));
  }

  public static fromHSV (hsv: HSVColor): ColorConvertable {
    return new ColorConvertable(HSVtoRGB(hsv));
  }

  public static fromLAB (lab: LABColor): ColorConvertable {
    return new ColorConvertable(LABtoRGB(lab));
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

  public get lab (): LABColor {
    return RGBtoLAB(this._rgb);
  }
}
