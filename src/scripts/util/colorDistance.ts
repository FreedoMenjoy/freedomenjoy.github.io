import { type RGBColor } from './color';
import { RGBtoHSV, RGBtoLAB } from './colorConvert';

export type ColorDistanceFn = (rgb1: RGBColor, rgb2: RGBColor) => number;

export function colorDistanceWeightedSquare (rgb1: RGBColor, rgb2: RGBColor): number {
  const dR = rgb1[0] - rgb2[0];
  const dG = rgb1[1] - rgb2[1];
  const dB = rgb1[2] - rgb2[2];
  const R = (rgb1[0] + rgb2[0]) / 2;
  if (R < 128) return 2 * dR * dR + 4 * dG * dG + 3 * dB * dB;
  else return 3 * dR * dR + 4 * dG * dG + 2 * dB * dB;
}

export function colorDistanceWeighted (rgb1: RGBColor, rgb2: RGBColor): number {
  return Math.sqrt(colorDistanceWeightedSquare(rgb1, rgb2));
}

export function colorDistanceRedmeanSquare (rgb1: RGBColor, rgb2: RGBColor): number {
  const dR = rgb1[0] - rgb2[0];
  const dG = rgb1[1] - rgb2[1];
  const dB = rgb1[2] - rgb2[2];
  const R = (rgb1[0] + rgb2[0]) / 2;
  return (2 + R / 256) * dR * dR + 4 * dG * dG + (2 + (255 - R) / 256) * dB * dB;
}

export function colorDistanceRedmean (rgb1: RGBColor, rgb2: RGBColor): number {
  return Math.sqrt(colorDistanceRedmeanSquare(rgb1, rgb2));
}

export function colorDistanceParamspaceSquare (rgb1: RGBColor, rgb2: RGBColor): number {
  const dR = rgb1[0] - rgb2[0];
  const dG = rgb1[1] - rgb2[1];
  const dB = rgb1[2] - rgb2[2];
  return dR * dR + dG * dG + dB * dB;
}

export function colorDistanceParamspace (rgb1: RGBColor, rgb2: RGBColor): number {
  return Math.sqrt(colorDistanceParamspaceSquare(rgb1, rgb2));
}

export function colorDistanceLabParamspaceSquare (rgb1: RGBColor, rgb2: RGBColor): number {
  const lab1 = RGBtoLAB(rgb1);
  const lab2 = RGBtoLAB(rgb2);

  const dL = lab1[0] - lab2[0];
  const dA = lab1[1] - lab2[1];
  const dB = lab1[2] - lab2[2];

  return dL * dL + dA * dA + dB * dB;
}

export function colorDistanceLabParamspace (rgb1: RGBColor, rgb2: RGBColor): number {
  return Math.sqrt(colorDistanceLabParamspaceSquare(rgb1, rgb2));
}

export function colorDistanceHSVMetricSquare (rgb1: RGBColor, rgb2: RGBColor): number {
  const [h1, s1, v1] = RGBtoHSV(rgb1);
  const [h2, s2, v2] = RGBtoHSV(rgb2);
  const rawdh = Math.abs(h1 - h2);
  const dh = Math.min(rawdh, 1 - rawdh);
  const ds = s1 - s2;
  const dv = v1 - v2;
  return dh * dh + ds * ds + dv * dv;
}

export function colorDistanceHSVMetric (rgb1: RGBColor, rgb2: RGBColor): number {
  return Math.sqrt(colorDistanceHSVMetric(rgb1, rgb2));
}

export function colorDistanceHSVConeSquared (rgb1: RGBColor, rgb2: RGBColor): number {
  const hsv1 = RGBtoHSV(rgb1);
  const hsv2 = RGBtoHSV(rgb2);
  const h1 = hsv1[0] * Math.PI; const s1 = hsv1[1]; const v1 = hsv1[2];
  const h2 = hsv2[0] * Math.PI; const s2 = hsv2[1]; const v2 = hsv2[2];
  const sins = Math.sin(h1) * s1 * v1 - Math.sin(h2) * s2 * v2;
  const coss = Math.cos(h1) * s1 * v1 - Math.cos(h2) * s2 * v2;
  const vs = v1 - v2;
  return sins * sins + coss * coss + vs * vs;
}

export function colorDistanceHSVCone (rgb1: RGBColor, rgb2: RGBColor): number {
  return Math.sqrt(colorDistanceHSVConeSquared(rgb1, rgb2));
}
