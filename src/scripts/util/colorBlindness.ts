import { type RGBColor } from './color';

export const ColorBlindnessMatrixes: Record<string, number[][]> = {
  normal: [
    [100, 0, 0],
    [0, 100, 0],
    [0, 0, 100],
  ],
  protanopia: [
    [56.667, 43.333, 0],
    [55.833, 44.167, 0],
    [0, 24.167, 75.833],
  ],
  protanomaly: [
    [81.667, 18.333, 0],
    [33.333, 66.667, 0],
    [0, 12.5, 87.5],
  ],
  deuteranopia: [
    [62.5, 37.5, 0],
    [70, 30, 0],
    [0, 30, 70],
  ],
  deuteranomaly: [
    [80, 20, 0],
    [25.833, 74.167, 0],
    [0, 14.167, 85.833],
  ],
  tritanopia: [
    [95, 5, 0],
    [0, 43.333, 56.667],
    [0, 47.5, 52.5],
  ],
  tritanomaly: [
    [96.667, 3.333, 0],
    [0, 73.333, 26.667],
    [0, 18.333, 81.667],
  ],
  achromatopsia: [
    [29.9, 58.7, 11.4],
    [29.9, 58.7, 11.4],
    [29.9, 58.7, 11.4],
  ],
  achromatomaly: [
    [61.8, 32, 6.2],
    [16.3, 77.5, 6.2],
    [16.3, 32.0, 51.6],
  ],
};

export function RGBToColorBlind (rgb: RGBColor, matrix: number[][]): RGBColor {
  const [r, g, b] = rgb;
  return [
    r * matrix[0][0] / 100.0 + g * matrix[0][1] / 100.0 + b * matrix[0][2] / 100.0,
    r * matrix[1][0] / 100.0 + g * matrix[1][1] / 100.0 + b * matrix[1][2] / 100.0,
    r * matrix[2][0] / 100.0 + g * matrix[2][1] / 100.0 + b * matrix[2][2] / 100.0,
  ];
}

export function makeRGBToColorBlind (matrix: number[][], name?: string): (rgb: RGBColor) => RGBColor {
  return function _RGBToColorBlind (rgb: RGBColor): RGBColor {
    return RGBToColorBlind(rgb, matrix);
  };
}

export const ColorBlindnessMatrixesFns: Record<string, (rgb: RGBColor) => RGBColor> = Object.fromEntries(
  Object.keys(ColorBlindnessMatrixes).map(key => ([key, makeRGBToColorBlind(ColorBlindnessMatrixes[key], key)])),
);

Object.assign(window, {
  ColorBlindnessMatrixes,
  RGBToColorBlind,
  makeRGBToColorBlind,
  ColorBlindnessMatrixesFns,
});
