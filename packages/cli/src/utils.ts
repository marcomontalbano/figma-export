import fs from 'fs';
import path from 'path';

const resolveNameOrPath = (nameOrPath: string): string => {
    const absolutePath = path.resolve(nameOrPath);
    return fs.existsSync(absolutePath) ? absolutePath : nameOrPath;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const requirePackages = async <T extends Function>(packages: string[], baseOptions = {}): Promise<T[]> => {
    return Promise.all(
        packages.map(async (_pkg) => {
            const pkgNameOrPath = resolveNameOrPath(_pkg);

            const pkg = await import(pkgNameOrPath).then((p) => p.default);

            return pkg(baseOptions);
        }),
    );
};

export function asUndefinableArray<T>(entry: T | T[] | undefined): T[] | undefined {
    return entry ? ([] as T[]).concat(entry) : undefined;
}

export function asArray<T>(entry: T | T[] | undefined): T[] {
    return asUndefinableArray(entry) ?? [];
}
