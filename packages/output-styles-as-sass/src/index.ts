import * as FigmaExport from '@figma-export/types';
import { kebabCase } from '@figma-export/utils';

import { Extension } from './types.js';
import { writeVariable } from './utils.js';

import fs from 'fs';
import path from 'path';

type Options = {
    output: string;
    getExtension?: () => Extension;
    getFilename?: () => string;
    getVariableName?: FigmaExport.GetVariableName
}

export default ({
    output,
    getExtension = () => 'SCSS',
    getFilename = () => '_variables',
    getVariableName = (style, descriptor) => `${kebabCase(style.name).toLowerCase()}${descriptor != null ? `-${descriptor}` : ''}`,
}: Options): FigmaExport.StyleOutputter => {
    return async (styles) => {
        const extension = getExtension();

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

                        text += writeVariable(style.comment, getVariableName(style), value, extension);

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
                        text += writeVariable(style.comment, getVariableName(style), boxShadowValue || filterBlurValue, extension);

                        break;
                    }

                    case 'TEXT': {
                        const value = `(
                            "font-family": "${style.style.fontFamily}",
                            "font-size": ${style.style.fontSize}px,
                            "font-style": ${style.style.fontStyle},
                            "font-variant": ${style.style.fontVariant},
                            "font-weight": ${style.style.fontWeight},
                            "letter-spacing": ${style.style.letterSpacing}px,
                            "line-height": ${style.style.lineHeight},
                            "text-align": ${style.style.textAlign},
                            "text-decoration": ${style.style.textDecoration},
                            "text-transform": ${style.style.textTransform},
                            "vertical-align": ${style.style.verticalAlign}
                        )`;

                        text += writeVariable(style.comment, getVariableName(style), value, extension);

                        text += writeVariable(
                            style.comment,
                            getVariableName(style, 'font-family'),
                            `"${style.style.fontFamily}"`,
                            extension,
                        );
                        text += writeVariable(
                            style.comment,
                            getVariableName(style, 'font-size'),
                            `${style.style.fontSize}px`,
                            extension,
                        );
                        text += writeVariable(
                            style.comment,
                            getVariableName(style, 'font-style'),
                            `${style.style.fontStyle}`,
                            extension,
                        );
                        text += writeVariable(
                            style.comment,
                            getVariableName(style, 'font-variant'),
                            `${style.style.fontVariant}`,
                            extension,
                        );
                        text += writeVariable(
                            style.comment,
                            getVariableName(style, 'font-weight'),
                            `${style.style.fontWeight}`,
                            extension,
                        );
                        text += writeVariable(
                            style.comment,
                            getVariableName(style, 'letter-spacing'),
                            `${style.style.letterSpacing}px`,
                            extension,
                        );
                        text += writeVariable(
                            style.comment,
                            getVariableName(style, 'line-height'),
                            `${style.style.lineHeight}`,
                            extension,
                        );
                        text += writeVariable(
                            style.comment,
                            getVariableName(style, 'text-align'),
                            `${style.style.textAlign}`,
                            extension,
                        );
                        text += writeVariable(
                            style.comment,
                            getVariableName(style, 'text-decoration'),
                            `${style.style.textDecoration}`,
                            extension,
                        );
                        text += writeVariable(
                            style.comment,
                            getVariableName(style, 'text-transform'),
                            `${style.style.textTransform}`,
                            extension,
                        );
                        text += writeVariable(
                            style.comment,
                            getVariableName(style, 'vertical-align'),
                            `${style.style.verticalAlign}`,
                            extension,
                        );

                        break;
                    }
                }
            }
        });

        const filePath = path.resolve(output);

        fs.mkdirSync(filePath, { recursive: true });
        fs.writeFileSync(path.resolve(filePath, `${getFilename()}.${extension.toLowerCase()}`), text);
    };
};
