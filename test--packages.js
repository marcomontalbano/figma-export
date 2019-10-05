/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const { readdirSync, statSync } = require('fs');
const { resolve } = require('path');

const isDirectory = (source) => statSync(source).isDirectory();

const walkSync = (dir, startDir = dir) => {
    let filelist = [];
    const files = readdirSync(dir);

    files.forEach((file) => {
        if (isDirectory(dir + file)) {
            filelist = [...filelist, ...walkSync(`${dir}${file}/`, startDir)];
            return;
        }

        const isNodeModules = /node_modules/.test(dir);
        const isTestFile = /\.test\.js$/.test(file);

        if (!isNodeModules && isTestFile) {
            filelist.push(`${dir}${file}`);
        }
    });

    return filelist;
};

const getPackages = () => {
    const packagesFolder = resolve('packages');
    return readdirSync(packagesFolder).map((name) => resolve(packagesFolder, name)).filter(isDirectory);
};

const describePackage = (packagePath) => {
    const packageJson = resolve(packagePath, 'package.json');
    const { name } = require(packageJson);

    describe(name, () => {
        walkSync(`${packagePath}/`).forEach(require);
    });
};

getPackages().forEach(describePackage);
