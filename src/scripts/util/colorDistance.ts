import { type RGBColor } from './color';

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
