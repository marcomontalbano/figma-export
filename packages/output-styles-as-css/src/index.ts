import * as FigmaExport from '@figma-export/types';
import { kebabCase } from '@figma-export/utils';

import { writeVariable, writeComment, sanitizeText } from './utils';

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

                        if (value) {
                            text += writeComment(style.comment);
                            text += writeVariable(variableName, value);
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
                            text += writeVariable(variableName, value);
                        }

                        break;
                    }

                    case 'TEXT': {
                        text += writeComment(style.comment);
                        text += writeVariable(`${variableName}-font-family`, `"${style.style.fontFamily}"`);
                        text += writeVariable(`${variableName}-font-size`, `${style.style.fontSize}px`);
                        text += writeVariable(`${variableName}-font-style`, `${style.style.fontStyle}`);
                        text += writeVariable(`${variableName}-font-variant`, `${style.style.fontVariant}`);
                        text += writeVariable(`${variableName}-font-weight`, `${style.style.fontWeight}`);
                        text += writeVariable(`${variableName}-letter-spacing`, `${style.style.letterSpacing}px`);
                        text += writeVariable(`${variableName}-line-height`, `${style.style.lineHeight}px`);
                        text += writeVariable(`${variableName}-text-align`, `${style.style.textAlign}`);
                        text += writeVariable(`${variableName}-text-decoration`, `${style.style.textDecoration}`);
                        text += writeVariable(`${variableName}-text-transform`, `${style.style.textTransform}`);
                        text += writeVariable(`${variableName}-vertical-align`, `${style.style.verticalAlign}`);

                        break;
                    }
                }
            }
        });

        const filePath = path.resolve(output);

        fs.mkdirSync(filePath, { recursive: true });
        fs.writeFileSync(path.resolve(filePath, `${getFilename()}.css`), sanitizeText(`
            :root {
                ${text}
            }
        `));
    };
};
