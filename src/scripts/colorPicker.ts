import { canvasGetImageDataAvgColor, distanceWeightConst, distanceWeightEuclidean, distanceWeightEuclidean2, type DistanceWeightFn, distanceWeightManhattan, distanceWeightManhattan2, CanvasUndoableRect } from "./util/canvas";
import { RGBColorToHex, type RGBColor } from "./util/color";
import { colorClosest } from "./util/colorClosest";
import { ColorDistanceFn, colorDistanceParamspaceSquare, colorDistanceRedmeanSquare, colorDistanceWeightedSquare } from "./util/colorDistance";
import { colorNames } from "./util/colorNames";
import { colorNamesSimple } from "./util/colorNamesSimple";
import { addEventListenerMouseDownMove } from "./util/EventListener";

const sliderPointRadiusElement = document.getElementById('input-point-radius') as HTMLInputElement;
const selectPointDistFnElement = document.getElementById('select-point-dist-fn') as HTMLOptionElement;
const checkboxPointDraw = document.getElementById('input-point-draw') as HTMLInputElement;
const selectColorDistFnElement = document.getElementById('select-color-dist-fn') as HTMLOptionElement;
const fileInputElement = document.getElementById('file-input') as HTMLInputElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvas2d: CanvasRenderingContext2D = canvas.getContext('2d', { willReadFrequently: true })!;

Object.assign(window, { canvas, canvas2d });

const distFns = {
  euclidean: distanceWeightEuclidean,
  euclidean2: distanceWeightEuclidean2,
  manhattan: distanceWeightManhattan,
  manhattan2: distanceWeightManhattan2,
  const: distanceWeightConst,
} as const;

const colorDistFns = {
  redmean: colorDistanceRedmeanSquare,
  weighted: colorDistanceWeightedSquare,
  paramspace: colorDistanceParamspaceSquare,
};

function onFileInput (evt: Event): void {
  const files = (evt.target as HTMLInputElement).files;
  if (files == null) return;
  const file = files[0];

  if (!file.type.match('image.*')) return;

  const reader = new FileReader();

  reader.addEventListener('load', (e) => {
    console.log('file', file, e, reader.result);
    if (reader.result == null) return;
    const img = document.createElement('img');
    // Render thumbnail.
    img.src = String(reader.result);
    // img.title = theFile.name;

    img.addEventListener('load', function onImageLoad () {
      console.log(`img width:${img.width} height:${img.height}`);

      const canvasRect = canvas.getBoundingClientRect();

      // canvas.width = Math.max(img.width, 200);
      // canvas.height = Math.max(img.height, 200);
      canvas2d.drawImage(img, 0, 0, canvasRect.width, canvasRect.height);
    });
  });

  // Read in the image file as a data URL.
  reader.readAsDataURL(file);
}

fileInputElement.addEventListener('change', onFileInput);

let canvasRect: CanvasUndoableRect | null = null;

const textColorRGB = document.getElementById('text-color-rgb') as HTMLSpanElement;
const textColorHex = document.getElementById('text-color-hex') as HTMLSpanElement;
const textColorColor = document.getElementById('text-color-color') as HTMLSpanElement;

const textColorName = document.getElementById('text-color-name') as HTMLSpanElement;
const textColorNameRGB = document.getElementById('text-color-name-rgb') as HTMLSpanElement;
const textColorNameHex = document.getElementById('text-color-name-hex') as HTMLSpanElement;
const textColorNameColor = document.getElementById('text-color-name-color') as HTMLSpanElement;

const textColorNameSimple = document.getElementById('text-color-name-simple') as HTMLSpanElement;
const textColorNameSimpleRGB = document.getElementById('text-color-name-simple-rgb') as HTMLSpanElement;
const textColorNameSimpleHex = document.getElementById('text-color-name-simple-hex') as HTMLSpanElement;
const textColorNameSimpleColor = document.getElementById('text-color-name-simple-color') as HTMLSpanElement;

function onMouseMove (e: MouseEvent): void {
  canvasRect?.undo();
  canvasRect = null;

  const x = Math.min(e.offsetX, canvas.width - 1);
  const y = Math.min(e.offsetY, canvas.height - 1);
  const rectSize = Math.floor(Number(sliderPointRadiusElement.value));
  const distFn: DistanceWeightFn = Reflect.get(distFns, selectPointDistFnElement.value);
  const colorDistFn: ColorDistanceFn = Reflect.get(colorDistFns, selectColorDistFnElement.value);
  const color = canvasGetImageDataAvgColor(canvas, x, y, { rectSize, distFn });
  const roundColors: RGBColor = color.map(Math.round) as RGBColor;
  // textElement.innerText = `x:${x} y:${y} color:[${roundColors.join(', ')}] rectSize:${rectSize} distFn:${distFn.name} rect:[${color.rectX}, ${color.rectY}, ${color.rectW}, ${color.rectH}: ${color.rectX + color.rectW - 1}, ${color.rectY + color.rectH - 1}]`;
  const closestColorName = colorClosest(color, colorNames, colorDistFn);
  const closestColorNameSimple = colorClosest(color, colorNamesSimple, colorDistFn);

  textColorRGB.innerText = roundColors.join(', ');
  textColorHex.innerText = RGBColorToHex(roundColors);
  textColorColor.style.backgroundColor = `rgb(${roundColors.join(', ')})`;

  textColorName.innerText = closestColorName.name;
  textColorNameRGB.innerText = closestColorName.color.join(', ');
  textColorNameHex.innerText = RGBColorToHex(closestColorName.color);
  textColorNameColor.style.backgroundColor = `rgb(${closestColorName.color.join(', ')})`;

  textColorNameSimple.innerText = closestColorNameSimple.name;
  textColorNameSimpleRGB.innerText = closestColorNameSimple.color.join(', ');
  textColorNameSimpleHex.innerText = RGBColorToHex(closestColorNameSimple.color);
  textColorNameSimpleColor.style.backgroundColor = `rgb(${closestColorNameSimple.color.join(', ')})`;

  if (checkboxPointDraw.checked) {
    canvas2d.beginPath();
    canvas2d.lineWidth = 1;
    canvas2d.strokeStyle = 'red';
    canvasRect = CanvasUndoableRect.rect(canvas2d, color.rectX, color.rectY, color.rectW, color.rectH);
    canvas2d.stroke();
  }
}

addEventListenerMouseDownMove(canvas, onMouseMove);
