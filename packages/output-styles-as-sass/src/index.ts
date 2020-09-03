import * as FigmaExport from '@figma-export/types';
import { writeVariable } from './utils';
import { Extension } from './types';

import fs = require('fs');
import path = require('path');
import makeDir = require('make-dir');

type Options = {
    output: string;
    getExtension?: () => Extension;
    getFilename?: () => string;
}

export = ({
    output,
    getExtension = () => 'SCSS',
    getFilename = () => '_variables',
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

                        text += writeVariable(style.comment, style.name, value, extension);

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

                        // TODO: add to documentation. "you cannot combine shadow and blur effects"
                        text += writeVariable(style.comment, style.name, boxShadowValue || filterBlurValue, extension);

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
                            "line-height": ${style.style.lineHeightPx}px,
                            "text-align": ${style.style.textAlign},
                            "text-decoration": ${style.style.textDecoration},
                            "text-transform": ${style.style.textTransform},
                            "vertical-align": ${style.style.verticalAlign}
                        )`;

                        text += writeVariable(style.comment, style.name, value, extension);

                        break;
                    }

                    case 'GRID': {
                        break;
                    }
                }
            }
        });

        const filePath = makeDir.sync(path.resolve(output));
        fs.writeFileSync(path.resolve(filePath, `${getFilename()}.${extension.toLowerCase()}`), text);
    };
};
