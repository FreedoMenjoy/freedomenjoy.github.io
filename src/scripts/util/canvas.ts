/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type RGBColor } from './color';
import { clamp as mathClamp } from './math';

export interface MouseEventPosition {
  x: number;
  y: number;
}

export function canvasMouseEventPosition (canvas: HTMLCanvasElement, event: MouseEvent, clamp: boolean = true): MouseEventPosition {
  const canvasRect = canvas.getBoundingClientRect();
  const x = Math.round((event.pageX - canvasRect.left - scrollX) / canvasRect.width * canvas.width);
  const y = Math.round((event.pageY - canvasRect.top - scrollY) / canvasRect.height * canvas.height);
  if (clamp) return { x: mathClamp(0, x, canvas.width - 1), y: mathClamp(0, x, canvas.height - 1) };
  return { x, y };
}

export type DistanceWeightFn = (dx: number, dy: number) => number;

export function distanceWeightEuclidean (dx: number, dy: number): number {
  return 1 / (Math.sqrt(dx * dx + dy * dy) + 1);
}

export function distanceWeightEuclidean2 (dx: number, dy: number): number {
  const mult = distanceWeightEuclidean(dx, dy);
  return mult * mult;
}

export function distanceWeightManhattan (dx: number, dy: number): number {
  return 1 / (Math.abs(dx) + Math.abs(dy) + 1);
}

export function distanceWeightManhattan2 (dx: number, dy: number): number {
  const mult = distanceWeightManhattan(dx, dy);
  return mult * mult;
}

export function distanceWeightConst (dx: number, dy: number): number {
  return 1;
}

export function canvasGetImageDataAvgColor (canvas: HTMLCanvasElement, x: number, y: number, { rectSize = 1, distFn = distanceWeightEuclidean, canvas2d = canvas.getContext('2d')! } = {}): RGBColor & { rectX: number, rectY: number, rectW: number, rectH: number } {
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let avger = 0;
  const rectX = Math.max(x - rectSize, 0);
  const rectY = Math.max(y - rectSize, 0);
  const rectW = Math.max(Math.min(canvas.width - x + rectSize, rectSize * 2 + 1, Math.min(x, rectSize) + rectSize + 1), 1);
  const rectH = Math.max(Math.min(canvas.height - y + rectSize, rectSize * 2 + 1, Math.min(y, rectSize) + rectSize + 1), 1);
  const data = canvas2d.getImageData(rectX, rectY, rectW, rectH).data;
  for (let i = 0; i < data.length; i += 4) {
    const di = i / 4;
    const dx = rectX + (di % rectW) - x;
    const dy = rectY + Math.floor(di / rectW) - y;
    const R = data[i];
    const G = data[i + 1];
    const B = data[i + 2];
    const mult = distFn(dx, dy);
    sumR += R * R * mult;
    sumG += G * G * mult;
    sumB += B * B * mult;
    avger += mult;
  }
  const color: RGBColor = [
    Math.sqrt(sumR / avger),
    Math.sqrt(sumG / avger),
    Math.sqrt(sumB / avger),
  ];
  return Object.assign(color, { rectX, rectY, rectW, rectH });
}

export class CanvasUndoableRect {
  private constructor (
    public readonly canvas2d: CanvasRenderingContext2D,
    public readonly x: number,
    public readonly y: number,
    public readonly width: number,
    public readonly height: number,
    public readonly lineWidth: number,
    public readonly data: ImageData,
  ) {}

  public get effectiveX (): number {
    return this.x - this.lineWidth - 1;
  }

  public get effectiveY (): number {
    return this.y - this.lineWidth - 1;
  }

  public get effectiveWidth (): number {
    return this.width + this.lineWidth + this.lineWidth + 2;
  }

  public get effectiveHeight (): number {
    return this.height + this.lineWidth + this.lineWidth + 2;
  }

  public static rect (canvas2d: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): CanvasUndoableRect {
    const lineWidth = canvas2d.lineWidth;
    const data = canvas2d.getImageData(x - lineWidth - 1, y - lineWidth - 1, width + lineWidth + lineWidth + 2, height + lineWidth + lineWidth + 2);
    canvas2d.rect(x, y, width, height);
    return new CanvasUndoableRect(canvas2d, x, y, width, height, lineWidth, data);
  }

  public undo (): void {
    this.canvas2d.putImageData(this.data, this.effectiveX, this.effectiveY);
  }
}
