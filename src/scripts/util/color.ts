import { clamp } from "./math";

export type RGBColor = [r: number, g: number, b: number];

function fixColorValue (value: number): number {
  return clamp(0, Math.round(value), 255);
}

export function RGBColorToHex (color: RGBColor): string {
  return Number.prototype.toString.call(fixColorValue(color[0]) * 0x10000 + fixColorValue(color[1]) * 0x100 + fixColorValue(color[2]), 16).padStart(6, '0');
}

export interface ColorName {
  name: string;
  color: RGBColor;
}
