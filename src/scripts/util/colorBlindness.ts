import { type RGBColor } from './color';

export const ColorBlindnessMatrixes: Record<string, number[][]> = {
  normal: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  protanopia: [
    [0.56667, 0.43333, 0],
    [0.55833, 0.44167, 0],
    [0, 0.24167, 0.75833],
  ],
  protanomaly: [
    [0.81667, 0.18333, 0],
    [0.33333, 0.66667, 0],
    [0, 0.125, 0.875],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.70, 0.30, 0],
    [0, 0.30, 0.70],
  ],
  deuteranomaly: [
    [0.80, 0.20, 0],
    [0.25833, 0.74167, 0],
    [0, 0.14167, 0.85833],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.43333, 0.56667],
    [0, 0.475, 0.525],
  ],
  tritanomaly: [
    [0.96667, 0.03333, 0],
    [0, 0.73333, 0.26667],
    [0, 0.18333, 0.81667],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
  achromatomaly: [
    [0.618, 0.32, 0.062],
    [0.163, 0.775, 0.062],
    [0.163, 0.320, 0.516],
  ],
};

export function RGBToColorBlind (rgb: RGBColor, matrix: number[][]): RGBColor {
  const [r, g, b] = rgb;
  const [matrixR, matrixG, matrixB] = matrix;
  return [
    r * matrixR[0] + g * matrixR[1] + b * matrixR[2],
    r * matrixG[0] + g * matrixG[1] + b * matrixG[2],
    r * matrixB[0] + g * matrixB[1] + b * matrixB[2],
  ];
}

export function makeRGBToColorBlind (matrix: number[][]): (rgb: RGBColor) => RGBColor {
  const [matrixR, matrixG, matrixB] = matrix;
  return function _RGBToColorBlind (rgb: RGBColor): RGBColor {
    const [r, g, b] = rgb;
    return [
      r * matrixR[0] + g * matrixR[1] + b * matrixR[2],
      r * matrixG[0] + g * matrixG[1] + b * matrixG[2],
      r * matrixB[0] + g * matrixB[1] + b * matrixB[2],
    ];
  };
}

export const ColorBlindnessMatrixesFns: Record<string, (rgb: RGBColor) => RGBColor> = Object.fromEntries(
  Object.keys(ColorBlindnessMatrixes).map(key => ([key, makeRGBToColorBlind(ColorBlindnessMatrixes[key])])),
);

Object.assign(window, {
  ColorBlindnessMatrixes,
  RGBToColorBlind,
  makeRGBToColorBlind,
  ColorBlindnessMatrixesFns,
});
