import fs from 'fs';
import path from 'path';

const resolveNameOrPath = (nameOrPath: string): string => {
    const absolutePath = path.resolve(nameOrPath);
    return fs.existsSync(absolutePath) ? absolutePath : nameOrPath;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const requirePackages = <T extends Function>(packages: string[], baseOptions = {}): T[] => {
    return packages.map((pkg) => {
        const pkgNameOrPath = resolveNameOrPath(pkg);

        // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
        return require(pkgNameOrPath)(baseOptions);
    });
};

export function asUndefinableArray<T>(entry: T | T[] | undefined): T[] | undefined {
    return entry ? ([] as T[]).concat(entry) : undefined;
}

export function asArray<T>(entry: T | T[] | undefined): T[] {
    return asUndefinableArray(entry) ?? [];
}
