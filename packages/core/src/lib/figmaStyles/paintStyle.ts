import * as Figma from 'figma-js';
import * as FigmaExport from '@figma-export/types';

import { notEmpty } from '../utils';

const extractColor = ({ color, opacity }: FigmaExport.ExtractableColor): (FigmaExport.Color | undefined) => {
    if (!color) {
        return undefined;
    }

    const convert = (figmaColor: number) => parseInt((figmaColor * 255).toFixed(0), 10);

    // eslint-disable-next-line object-curly-newline
    let { r = 0, g = 0, b = 0, a = 1 } = color;

    r = convert(r);
    g = convert(g);
    b = convert(b);
    a = opacity || a;

    return {
        r,
        g,
        b,
        a,
        rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
    };
};

const extractGradientLinear = (paint: Figma.Paint): (FigmaExport.LinearGradient | undefined) => {
    if (!paint.gradientStops || !paint.gradientHandlePositions) {
        return undefined;
    }

    const getAngle = (figmaGradientHandlePositions: readonly Figma.Vector2[]): string => {
        const [startPoint, endPoint] = figmaGradientHandlePositions;
        const deltaY = (endPoint.y - startPoint.y);
        const deltaX = (endPoint.x - startPoint.x);
        const deg = ((Math.atan2(deltaY, deltaX) * 180) / Math.PI) + 90;
        return `${parseFloat(deg.toFixed(2))}deg`;
    };

    const getGradientStops = (figmaGradientStops: readonly Figma.ColorStop[]): FigmaExport.LinearColorStop[] => {
        const gradientStops: FigmaExport.LinearColorStop[] = [];

        figmaGradientStops.forEach((stop) => {
            const color = extractColor(stop);
            const position = parseFloat((stop.position * 100).toFixed(3));

            if (color) {
                gradientStops.push({ color, position });
            }
        });

        return gradientStops;
    };

    return {
        angle: getAngle(paint.gradientHandlePositions),
        gradientStops: getGradientStops(paint.gradientStops),
    };
};

const createFillStyles = (fill: Figma.Paint): FigmaExport.FillStyle | undefined => {
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
                    value: `linear-gradient(${gradient.angle}, ${gradient.gradientStops.map((stop) => {
                        return `${stop.color.rgba} ${stop.position}%`;
                    }).join(', ')})`,
                };
            }

            break;
        }
    }

    return undefined;
};

const parse = (node: FigmaExport.StyleNode): FigmaExport.StyleTypeFill | undefined => {
    if (node.styleType === 'FILL' && node.type === 'RECTANGLE') {
        return {
            styleType: 'FILL',
            fills: Array.from(node.fills)
                .reverse()
                .map(createFillStyles)
                .filter(notEmpty),
        };
    }

    return undefined;
};

export {
    parse,
    extractColor,
};
