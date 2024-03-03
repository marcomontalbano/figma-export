import * as FigmaExport from '@figma-export/types';
import { kebabCase } from '@figma-export/utils';

import { sanitizeText, writeComment, writeVariable } from './utils.js';

import fs from 'fs';
import path from 'path';

type Options = {
    output: string;
    getFilename?: () => string;
    getVariableName?: FigmaExport.GetVariableName;
}

export default ({
    output,
    getFilename = () => '_variables',
    getVariableName = (style, descriptor) => `${kebabCase(style.name).toLowerCase()}${descriptor != null ? `-${descriptor}` : ''}`,
}: Options): FigmaExport.StyleOutputter => {
    return async (styles) => {
        let text = '';

        styles.forEach((style) => {
            if (style.visible) {
                // eslint-disable-next-line default-case
                switch (style.styleType) {
                    case 'FILL': {
                        const value = style.fills
                            .filter((fill) => fill.visible)
                            .map((fill) => fill.value)
                            .join(', ');

                        if (value) {
                            text += writeComment(style.comment);
                            text += writeVariable(getVariableName(style), value);
                        }

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
                        const value = boxShadowValue || filterBlurValue;

                        if (value) {
                            text += writeComment(style.comment);
                            text += writeVariable(getVariableName(style), value);
                        }

                        break;
                    }

                    case 'TEXT': {
                        text += writeComment(style.comment);
                        text += writeVariable(getVariableName(style, 'font-family'), `"${style.style.fontFamily}"`);
                        text += writeVariable(getVariableName(style, 'font-size'), `${style.style.fontSize}px`);
                        text += writeVariable(getVariableName(style, 'font-style'), `${style.style.fontStyle}`);
                        text += writeVariable(getVariableName(style, 'font-variant'), `${style.style.fontVariant}`);
                        text += writeVariable(getVariableName(style, 'font-weight'), `${style.style.fontWeight}`);
                        text += writeVariable(getVariableName(style, 'letter-spacing'), `${style.style.letterSpacing}px`);
                        text += writeVariable(getVariableName(style, 'line-height'), `${style.style.lineHeight}`);
                        text += writeVariable(getVariableName(style, 'text-align'), `${style.style.textAlign}`);
                        text += writeVariable(getVariableName(style, 'text-decoration'), `${style.style.textDecoration}`);
                        text += writeVariable(getVariableName(style, 'text-transform'), `${style.style.textTransform}`);
                        text += writeVariable(getVariableName(style, 'vertical-align'), `${style.style.verticalAlign}`);

                        break;
                    }
                }
            }
        });

        const filePath = path.resolve(output);

        fs.mkdirSync(filePath, { recursive: true });
        fs.writeFileSync(path.resolve(filePath, `${getFilename()}.css`), text !== '' ? sanitizeText(`
            :root {
                ${text}
            }
        `) : '');
    };
};
