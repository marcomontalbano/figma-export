import type * as Figma from '@figma/rest-api-spec';
import type { Color } from './PaintStyle.js';

export type EffectStyleShadow = {
  type: 'DROP_SHADOW' | 'INNER_SHADOW';
  color: Color;
  inset: boolean;
  offset: Figma.Vector;
  blurRadius: number;
  spreadRadius: number;
};

export type EffectStyleLayerBlur = {
  type: 'LAYER_BLUR';
  blurRadius: number;
};

export type EffectStyle = {
  visible: boolean;
  value: string;
} & (EffectStyleShadow | EffectStyleLayerBlur);

export type StyleTypeEffect = {
  styleType: 'EFFECT';
  effects: EffectStyle[];
};
