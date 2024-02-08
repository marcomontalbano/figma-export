import * as FigmaExport from '@figma-export/types';
import { kebabCase } from '@figma-export/utils';

import { Extension } from './types';
import { writeVariable } from './utils';

import fs = require('fs');
import path = require('path');

type Options = {
    output: string;
    getExtension?: () => Extension;
    getFilename?: () => string;
    getVariableName?: FigmaExport.GetVariableName;
}

export = ({
    output,
    getExtension = () => 'JSON',
    getFilename = () => 'base',
    getVariableName = (style, descriptor) => `${kebabCase(style.name).toLowerCase()}${descriptor != null ? `-${descriptor}` : ''}`,
}: Options): FigmaExport.StyleOutputter => {
    return async (styles) => {
        const extension = getExtension();

        const result = {};

        styles.forEach((style) => {
            if (style.visible) {
                // eslint-disable-next-line default-case
                switch (style.styleType) {
                    case 'FILL': {
                        const value = style.fills
                            .filter((fill) => fill.visible)
                            .map((fill) => fill.value)
                            .join(', ');

                        writeVariable(result, style.comment, getVariableName(style), value);

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
                        writeVariable(result, style.comment, getVariableName(style), boxShadowValue || filterBlurValue);

                        break;
                    }

                    case 'TEXT': {
                        writeVariable(result, style.comment, getVariableName(style, 'font-family'), `"${style.style.fontFamily}"`);
                        writeVariable(result, style.comment, getVariableName(style, 'font-size'), `${style.style.fontSize}px`);
                        writeVariable(result, style.comment, getVariableName(style, 'font-style'), `${style.style.fontStyle}`);
                        writeVariable(result, style.comment, getVariableName(style, 'font-variant'), `${style.style.fontVariant}`);
                        writeVariable(result, style.comment, getVariableName(style, 'font-weight'), `${style.style.fontWeight}`);
                        writeVariable(result, style.comment, getVariableName(style, 'letter-spacing'), `${style.style.letterSpacing}px`);
                        writeVariable(result, style.comment, getVariableName(style, 'line-height'), `${style.style.lineHeight}`);
                        writeVariable(result, style.comment, getVariableName(style, 'text-align'), `${style.style.textAlign}`);
                        writeVariable(result, style.comment, getVariableName(style, 'text-decoration'), `${style.style.textDecoration}`);
                        writeVariable(result, style.comment, getVariableName(style, 'text-transform'), `${style.style.textTransform}`);
                        writeVariable(result, style.comment, getVariableName(style, 'vertical-align'), `${style.style.verticalAlign}`);

                        break;
                    }
                }
            }
        });

        const filePath = path.resolve(output);

        fs.mkdirSync(filePath, { recursive: true });
        fs.writeFileSync(path.resolve(filePath, `${getFilename()}.${extension.toLowerCase()}`), JSON.stringify(result, undefined, 2));
    };
};
