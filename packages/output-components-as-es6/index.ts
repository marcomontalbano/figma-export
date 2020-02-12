import fs from 'fs';
import path from 'path';
import makeDir from 'make-dir';
import { camelCase } from '@figma-export/output-components-utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const svgToMiniDataURI = require('mini-svg-data-uri');


type FigmaExportType = {
    dirname: string;
    basename: string;
}

type OptionType = {
    componentName: string;
    pageName: string;
} & FigmaExportType;


type PageType = {
    id: string;
    name: string;
    type: string;
    components: ComponentType[];
};

type ComponentType = {
    name: string;
    svg: string;
    figmaExport: FigmaExportType;
}

type TransformerType = (pages: Array<PageType>) => Promise<void>;
type OutputterType = (pages: PageType[]) => Promise<void>;

type OutputComponentsAsEs6OptionType = {
    output: string;
    useBase64?: boolean;
    useDataUrl?: boolean;
    getVariableName?: (options: OptionType) => string;
}

export default ({
    output,
    getVariableName = (options): string => camelCase(options.componentName.trim()),
    useBase64 = false,
    useDataUrl = false,
}: OutputComponentsAsEs6OptionType): TransformerType => {
    makeDir.sync(output);
    return async (pages): Promise<void> => {
        pages.forEach((page) => {
            const { name: pageName, components } = page;

            let jsCode = '';

            components.forEach((component) => {
                const { name: componentName, svg, figmaExport } = component;

                const options: OptionType = {
                    pageName,
                    componentName,
                    ...figmaExport,
                };

                const variableName = getVariableName(options);
                let variableValue;

                if (/^[\d]+/.test(variableName)) {
                    throw new Error(`"${componentName.trim()}" thrown an error: component names cannot start with a number.`);
                }

                switch (true) {
                case useBase64:
                    variableValue = Buffer.from(svg).toString('base64');
                    break;
                case useDataUrl:
                    variableValue = svgToMiniDataURI(svg);
                    break;
                default:
                    variableValue = svg;
                    break;
                }

                if (jsCode.includes(`export const ${variableName} =`)) {
                    throw new Error(`Component "${componentName}" has an error: two components cannot have a same name.`);
                }

                jsCode += `export const ${variableName} = \`${variableValue}\`;\n`;
            });

            const filePath = path.resolve(output, `${pageName}.js`);
            fs.writeFileSync(filePath, jsCode);
        });
    };
};
