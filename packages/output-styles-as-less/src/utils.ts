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

export const writeVariable = (comment: string, name: string, value: string): string => {
    if (value) {
        return sanitizeText(`
            ${writeComment(comment)}
            @${name}: ${value};
        `);
    }

    return '';
};

export const writeMap = (comment: string, name: string, value: string): string => {
    if (value) {
        return sanitizeText(`
            ${writeComment(comment)}
            #${name}() ${value};
        `);
    }

    return '';
};
