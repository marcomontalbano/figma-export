import { StyleNode } from '../global';

import * as PaintStyle from './PaintStyle';
import * as EffectStyle from './EffectStyle';
import * as TextStyle from './TextStyle';
import * as GridStyle from './GridStyle';

export * from './PaintStyle';
export * from './EffectStyle';
export * from './TextStyle';
export * from './GridStyle';

export type Style = {
    name: string
    comment: string
    visible: boolean
    originalNode: StyleNode
} & (
      PaintStyle.StyleTypeFill
    | EffectStyle.StyleTypeEffect
    | TextStyle.StyleTypeText
    | GridStyle.StyleTypeGrid
)

export type StyleOutputter = (styles: Style[]) => Promise<void>
