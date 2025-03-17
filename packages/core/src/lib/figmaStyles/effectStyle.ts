import type * as FigmaExport from '@figma-export/types';
import type * as Figma from '@figma/rest-api-spec';

import { notNullish } from '../utils.js';
import { extractColor } from './paintStyle.js';

const createEffectStyle = (
  effect: Figma.Effect,
): FigmaExport.EffectStyle | undefined => {
  // eslint-disable-next-line default-case
  switch (effect.type) {
    case 'INNER_SHADOW':
    case 'DROP_SHADOW': {
      const color = extractColor(effect);
      const inset = effect.type === 'INNER_SHADOW';

      if (color && effect.offset) {
        return {
          type: effect.type,
          visible: effect.visible,
          color,
          inset,
          offset: effect.offset,
          blurRadius: effect.radius,
          spreadRadius: effect.spread ?? 0,
          value: `${inset ? 'inset ' : ''}${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${effect.spread ?? 0}px ${color.rgba}`,
        };
      }

      break;
    }

    case 'LAYER_BLUR': {
      return {
        type: effect.type,
        visible: effect.visible,
        blurRadius: effect.radius,
        value: `blur(${effect.radius}px)`,
      };
    }
  }

  return undefined;
};

const parse = (
  node: FigmaExport.StyleNode,
): FigmaExport.StyleTypeEffect | undefined => {
  if (node.styleType === 'EFFECT' && node.type === 'RECTANGLE') {
    return {
      styleType: 'EFFECT',
      effects: Array.from(node.effects)
        .reverse()
        .map(createEffectStyle)
        .filter(notNullish),
    };
  }

  return undefined;
};

export { parse };
