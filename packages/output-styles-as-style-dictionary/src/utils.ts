type StyleDictionaryValue = {
    comment?: string
    value: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function set(object: Record<string, any>, key: string, value: StyleDictionaryValue): void {
    const keys = key.split('.');
    let currentObject = object;

    for (let i = 0; i < keys.length; i += 1) {
        const currentKey = keys[i];
        if (i === keys.length - 1) {
            currentObject[currentKey] = value;
        } else {
            if (!currentObject[currentKey]) {
                currentObject[currentKey] = {};
            }
            currentObject = currentObject[currentKey];
        }
    }
}

const writeComment = (message: string): string | undefined => {
    if (message === '') {
        return undefined;
    }

    return message
        .replace(/\*\//g, '')
        .split('\n')
        .join(' ');
};

export const writeVariable = (obj: Record<string, unknown>, comment: string, name: string, value: string): void => {
    if (value) {
        set(
            obj,
            name.replace(/-/g, '.'),
            {
                comment: writeComment(comment),
                value,
            },
        );
    }
};
