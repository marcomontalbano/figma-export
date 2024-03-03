import { Extension } from './types.js';

const sanitizeText = (text: string): string => {
    return text
        .replace(/^[^\S\r\n]+/gm, '')
        .replace(/^\*/gm, ' *')
        .replace(/^"/gm, '  "');
};

const writeComment = (message: string): string => {
    return message && `/**
                        * ${message.replace(/\*\//g, '').split('\n').join('\n  * ')}
                        */`;
};

// eslint-disable-next-line consistent-return
const createVariable = (name: string, value: string, extension: Extension): string => {
    // eslint-disable-next-line default-case
    switch (extension) {
        case 'SCSS':
            return `$${name}: ${value};`;
        case 'SASS':
            return `$${name}: ${value.replace(/\n/g, ' ').replace(/\s\s+/g, ' ')}`;
    }
};

export const writeVariable = (comment: string, name: string, value: string, extension: Extension): string => {
    if (value) {
        return sanitizeText(`
            ${writeComment(comment)}
            ${createVariable(name, value, extension)}
        `);
    }

    return '';
};
