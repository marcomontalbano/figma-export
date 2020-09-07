import fs = require('fs');
import path = require('path');

const resolveNameOrPath = (nameOrPath: string): string => {
    const absolutePath = path.resolve(nameOrPath);
    return fs.existsSync(absolutePath) ? absolutePath : nameOrPath;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const requirePackages = <T extends Function>(packages: (T | string)[], baseOptions = {}): T[] => {
    return packages.map((pkg) => {
        if (typeof pkg === 'function') {
            return pkg;
        }

        const pkgNameOrPath = resolveNameOrPath(pkg);

        // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires
        return require(pkgNameOrPath)(baseOptions);
    });
};
