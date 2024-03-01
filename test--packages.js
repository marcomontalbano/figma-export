// @ts-check

import { readdirSync, statSync } from 'fs';
import { resolve } from 'path';

import Module from 'node:module';

const require = Module.createRequire(import.meta.url);

/**
 * Check whether the provided source is a directory
 * @type {(source: string) => boolean}
 */
const isDirectory = (source) => statSync(source).isDirectory();

/**
 * Check whether the provided source is a directory
 * @type {(dir: string, startDir?: string) => string[]}
 */
const getTestFiles = (dir, startDir = dir) => {
    let /** @type {string[]} */ fileList = [];
    const files = readdirSync(dir);

    files.forEach((/** @type {string} */ file) => {
        if (isDirectory(`${dir}${file}`)) {
            fileList = [...fileList, ...getTestFiles(`${dir}${file}/`, startDir)];
            return;
        }

        const isNodeModules = /node_modules/.test(dir);
        const isTestFile = /\.test\.[j|t]s$/.test(file);
        const isIntegrationFile = /integration\.test\.[j|t]s$/.test(file);

        if (!isNodeModules && isTestFile && !isIntegrationFile) {
            fileList.push(`${dir}${file}`);
        }
    });

    return fileList;
};

/** @type {() => string[]} */
const getPackages = () => {
    const /** @type {string} */ packagesFolder = resolve('packages');
    return readdirSync(packagesFolder)
        .map((filename) => resolve(packagesFolder, filename))
        .filter(isDirectory);
};

/** @type {(packagePath: string) => Promise<void>} */
const describePackage = async (packagePath) => {
    const packageJson = resolve(packagePath, 'package.json');
    // eslint-disable-next-line import/no-dynamic-require
    const { name: packageName } = require(packageJson);

    describe(packageName, () => {
        getTestFiles(`${packagePath}/`).forEach((testFile) => import(testFile));
    });
};

getPackages().forEach(describePackage);
