import { clamp } from './math';

/**
 * Value ranges: r - [0; 255], g - [0; 255], b - [0; 255]
 */
export type RGBColor = [r: number, g: number, b: number];

function fixRGBColorValue (value: number): number {
  return clamp(0, Math.round(value), 255);
}

export function RGBColorToHex (color: RGBColor): string {
  return Number.prototype.toString.call(fixRGBColorValue(color[0]) * 0x10000 + fixRGBColorValue(color[1]) * 0x100 + fixRGBColorValue(color[2]), 16).padStart(6, '0');
}

export interface RGBColorName {
  name: string;
  color: RGBColor;
}
