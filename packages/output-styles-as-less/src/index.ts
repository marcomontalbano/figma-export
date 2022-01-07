import * as FigmaExport from '@figma-export/types';
import { kebabCase } from '@figma-export/utils';

import { writeVariable, writeMap } from './utils';

import fs = require('fs');
import path = require('path');

type Options = {
    output: string;
    getFilename?: () => string;
    getVariableName?: (style: FigmaExport.Style) => string;
}

export = ({
    output,
    getFilename = () => '_variables',
    getVariableName = (style) => kebabCase(style.name).toLowerCase(),
}: Options): FigmaExport.StyleOutputter => {
    return async (styles) => {
        let text = '';

        styles.forEach((style) => {
            if (style.visible) {
                const variableName = getVariableName(style);

                // eslint-disable-next-line default-case
                switch (style.styleType) {
                    case 'FILL': {
                        const value = style.fills
                            .filter((fill) => fill.visible)
                            .map((fill) => fill.value)
                            .join(', ');

                        text += writeVariable(style.comment, variableName, value);

                        break;
                    }

                    case 'EFFECT': {
                        const visibleEffects = style.effects.filter((effect) => effect.visible);

                        const boxShadowValue = visibleEffects
                            .filter((effect) => effect.type === 'INNER_SHADOW' || effect.type === 'DROP_SHADOW')
                            .map((effect) => effect.value)
                            .join(', ');

                        const filterBlurValue = visibleEffects
                            .filter((effect) => effect.type === 'LAYER_BLUR')
                            .map((effect) => effect.value)
                            .join(', ');

                        // Shadow and Blur effects cannot be combined together since they use two different CSS properties.
                        text += writeVariable(style.comment, variableName, boxShadowValue || filterBlurValue);

                        break;
                    }

                    case 'TEXT': {
                        const value = `{
                            font-family: "${style.style.fontFamily}";
                            font-size: ${style.style.fontSize}px;
                            font-style: ${style.style.fontStyle};
                            font-variant: ${style.style.fontVariant};
                            font-weight: ${style.style.fontWeight};
                            letter-spacing: ${style.style.letterSpacing}px;
                            line-height: ${style.style.lineHeight}px;
                            text-align: ${style.style.textAlign};
                            text-decoration: ${style.style.textDecoration};
                            text-transform: ${style.style.textTransform};
                            vertical-align: ${style.style.verticalAlign};
                        }`;

                        text += writeMap(style.comment, variableName, value);

                        break;
                    }
                }
            }
        });

        const filePath = path.resolve(output);

        fs.mkdirSync(filePath, { recursive: true });
        fs.writeFileSync(path.resolve(filePath, `${getFilename()}.less`), text);
    };
};
