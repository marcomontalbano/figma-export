export const sanitizeText = (text: string): string => {
    return text
        .replace(/^[^\S\r\n]+/gm, '')
        .replace(/^\*/gm, ' *')
        .replace(/^"/gm, '  "');
};

export const writeComment = (message: string): string => {
    return sanitizeText(`
        /**
         * ${message.replace(/\*\//g, '').split('\n').join('\n  * ')}
         */
    `);
};

export const writeVariable = (name: string, value: string): string => {
    return value && sanitizeText(`--${name}: ${value};\n`);
};
