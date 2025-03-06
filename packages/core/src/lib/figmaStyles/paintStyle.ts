import type * as FigmaExport from '@figma-export/types';
import type * as Figma from 'figma-js';

import { notNullish } from '../utils.js';

const extractColor = ({
  color,
  opacity = 1,
}: FigmaExport.ExtractableColor): FigmaExport.Color | undefined => {
  if (!color) {
    return undefined;
  }

  const toFixed = (number: number, fractionDigits: number) =>
    Number.parseFloat(number.toFixed(fractionDigits));
  const convert = (figmaColor: number) => toFixed(figmaColor * 255, 0);

  // eslint-disable-next-line object-curly-newline
  let { r = 0, g = 0, b = 0, a = 1 } = color;

  r = convert(r);
  g = convert(g);
  b = convert(b);
  a = toFixed(opacity * a, 2);

  return {
    r,
    g,
    b,
    a,
    rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
  };
};

const extractGradientLinear = (
  paint: Figma.Paint,
): FigmaExport.LinearGradient | undefined => {
  if (!paint.gradientStops || !paint.gradientHandlePositions) {
    return undefined;
  }

  const getAngle = (
    figmaGradientHandlePositions: readonly Figma.Vector2[],
  ): string => {
    const [startPoint, endPoint] = figmaGradientHandlePositions;
    const deltaY = endPoint.y - startPoint.y;
    const deltaX = endPoint.x - startPoint.x;
    const deg = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90;
    return `${Number.parseFloat(deg.toFixed(2))}deg`;
  };

  const getGradientStops = (
    figmaGradientStops: readonly Figma.ColorStop[],
    opacity?: number,
  ): FigmaExport.LinearColorStop[] => {
    const gradientStops: FigmaExport.LinearColorStop[] = [];

    for (const stop of figmaGradientStops) {
      const color = extractColor({ ...stop, opacity });
      const position = Number.parseFloat((stop.position * 100).toFixed(3));

      if (color) {
        gradientStops.push({ color, position });
      }
    }

    return gradientStops;
  };

  return {
    angle: getAngle(paint.gradientHandlePositions),
    gradientStops: getGradientStops(paint.gradientStops, paint.opacity),
  };
};

const createFillStyles = (
  fill: Figma.Paint,
): FigmaExport.FillStyle | undefined => {
  // eslint-disable-next-line default-case
  switch (fill.type) {
    case 'SOLID': {
      const color = extractColor(fill);
      if (color) {
        return {
          type: 'SOLID',
          visible: fill.visible !== false,
          color,
          value: color.rgba,
        };
      }

      break;
    }

    case 'GRADIENT_LINEAR': {
      const gradient = extractGradientLinear(fill);
      if (gradient) {
        return {
          type: 'GRADIENT_LINEAR',
          visible: fill.visible !== false,
          ...gradient,
          value: `linear-gradient(${gradient.angle}, ${gradient.gradientStops
            .map((stop) => {
              return `${stop.color.rgba} ${stop.position}%`;
            })
            .join(', ')})`,
        };
      }

      break;
    }
  }

  return undefined;
};

const parse = (
  node: FigmaExport.StyleNode,
): FigmaExport.StyleTypeFill | undefined => {
  if (node.styleType === 'FILL' && node.type === 'RECTANGLE') {
    return {
      styleType: 'FILL',
      fills: Array.from(node.fills)
        .reverse()
        .map(createFillStyles)
        .filter(notNullish),
    };
  }

  return undefined;
};

export { parse, extractColor };
