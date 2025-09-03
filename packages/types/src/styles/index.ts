import type { StyleNode } from '../global.js';

import type * as EffectStyle from './EffectStyle.js';
import type * as GridStyle from './GridStyle.js';
import type * as PaintStyle from './PaintStyle.js';
import type * as TextStyle from './TextStyle.js';

export * from './EffectStyle.js';
export * from './GridStyle.js';
export * from './PaintStyle.js';
export * from './TextStyle.js';

export type Style = {
  name: string;
  comment: string;
  visible: boolean;
  originalNode: StyleNode;
} & (
  | PaintStyle.StyleTypeFill
  | EffectStyle.StyleTypeEffect
  | TextStyle.StyleTypeText
  | GridStyle.StyleTypeGrid
);

export type GetVariableName = (
  style: Style,
  descriptor?:
    | 'font-family'
    | 'font-size'
    | 'font-style'
    | 'font-variant'
    | 'font-weight'
    | 'letter-spacing'
    | 'line-height'
    | 'text-align'
    | 'text-decoration'
    | 'text-transform'
    | 'vertical-align',
) => string;

export type StyleOutputter = (styles: Style[]) => Promise<void>;
