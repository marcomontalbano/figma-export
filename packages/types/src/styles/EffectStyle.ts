import * as Figma from 'figma-js';
import { Color } from './PaintStyle';

export type EffectStyleShadow = {
    type: 'DROP_SHADOW' | 'INNER_SHADOW'
    color: Color
    inset: boolean
    offset: Figma.Vector2
    blurRadius: number
    spreadRadius: number
}

export type EffectStyleLayerBlur = {
    type: 'LAYER_BLUR'
    blurRadius: number
}

export type EffectStyle = {
    visible: boolean
    value: string
} & (EffectStyleShadow | EffectStyleLayerBlur)

export type StyleTypeEffect = {
    styleType: 'EFFECT'
    effects: EffectStyle[]
}
