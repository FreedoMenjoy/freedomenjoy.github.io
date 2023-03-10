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

/**
 * Value ranges: h - [0; 1], s - [0; 1], l - [0; 1]
 */
export type HSLColor = [h: number, s: number, l: number];

/**
 * Value ranges: h - [0; 1], s - [0; 1], v - [0; 1]
 */
export type HSVColor = [h: number, s: number, v: number];
