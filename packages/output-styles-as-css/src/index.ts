import * as FigmaExport from '@figma-export/types';
import { writeVariable, writeComment, sanitizeText } from './utils';

import fs = require('fs');
import path = require('path');

type Options = {
    output: string;
    getFilename?: () => string;
}

export = ({
    output,
    getFilename = () => '_variables',
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
                            text += writeVariable(style.name, value);
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
                            text += writeVariable(style.name, value);
                        }

                        break;
                    }

                    case 'TEXT': {
                        text += writeComment(style.comment);
                        text += writeVariable(`${style.name}-font-family`, `"${style.style.fontFamily}"`);
                        text += writeVariable(`${style.name}-font-size`, `${style.style.fontSize}px`);
                        text += writeVariable(`${style.name}-font-style`, `${style.style.fontStyle}`);
                        text += writeVariable(`${style.name}-font-variant`, `${style.style.fontVariant}`);
                        text += writeVariable(`${style.name}-font-weight`, `${style.style.fontWeight}`);
                        text += writeVariable(`${style.name}-letter-spacing`, `${style.style.letterSpacing}px`);
                        text += writeVariable(`${style.name}-line-height`, `${style.style.lineHeight}px`);
                        text += writeVariable(`${style.name}-text-align`, `${style.style.textAlign}`);
                        text += writeVariable(`${style.name}-text-decoration`, `${style.style.textDecoration}`);
                        text += writeVariable(`${style.name}-text-transform`, `${style.style.textTransform}`);
                        text += writeVariable(`${style.name}-vertical-align`, `${style.style.verticalAlign}`);

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
