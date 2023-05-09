import * as FigmaExport from '@figma-export/types';
import { kebabCase } from '@figma-export/utils';

import { writeVariable } from './utils';
import { Extension } from './types';

import fs = require('fs');
import path = require('path');

type Options = {
    output: string;
    getExtension?: () => Extension;
    getFilename?: () => string;
    getVariableName?: (style: FigmaExport.Style) => string;
}

export = ({
    output,
    getExtension = () => 'JSON',
    getFilename = () => 'base',
    getVariableName = (style) => kebabCase(style.name).toLowerCase(),
}: Options): FigmaExport.StyleOutputter => {
    return async (styles) => {
        const extension = getExtension();

        const result = {};

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

                        writeVariable(result, style.comment, variableName, value);

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
                        writeVariable(result, style.comment, variableName, boxShadowValue || filterBlurValue);

                        break;
                    }

                    case 'TEXT': {
                        writeVariable(result, style.comment, `${variableName}-font-family`, `"${style.style.fontFamily}"`);
                        writeVariable(result, style.comment, `${variableName}-font-size`, `${style.style.fontSize}px`);
                        writeVariable(result, style.comment, `${variableName}-font-style`, `${style.style.fontStyle}`);
                        writeVariable(result, style.comment, `${variableName}-font-variant`, `${style.style.fontVariant}`);
                        writeVariable(result, style.comment, `${variableName}-font-weight`, `${style.style.fontWeight}`);
                        writeVariable(result, style.comment, `${variableName}-letter-spacing`, `${style.style.letterSpacing}px`);
                        writeVariable(result, style.comment, `${variableName}-line-height`, `${style.style.lineHeight}px`);
                        writeVariable(result, style.comment, `${variableName}-text-align`, `${style.style.textAlign}`);
                        writeVariable(result, style.comment, `${variableName}-text-decoration`, `${style.style.textDecoration}`);
                        writeVariable(result, style.comment, `${variableName}-text-transform`, `${style.style.textTransform}`);
                        writeVariable(result, style.comment, `${variableName}-vertical-align`, `${style.style.verticalAlign}`);

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
