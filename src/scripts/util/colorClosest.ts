import { type ColorName, type RGBColor } from "./color";
import { ColorDistanceFn } from "./colorDistance";

export function colorClosest (color: RGBColor, colorNames: ColorName[], distFn: ColorDistanceFn): ColorName {
  let foundColorName: ColorName = colorNames[0];
  let foundDistance: number = distFn(color, foundColorName.color);
  for (let i = 1; i < colorNames.length; i++) {
    const colorName = colorNames[i];
    const newDistance = distFn(color, colorName.color);
    if (newDistance < foundDistance) {
      foundColorName = colorName;
      foundDistance = newDistance;
    }
  }
  return foundColorName;
}
