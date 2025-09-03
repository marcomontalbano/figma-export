import fs from 'node:fs';
import path from 'node:path';
import type * as FigmaExport from '@figma-export/types';
import { camelCase } from '@figma-export/utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
import svgToMiniDataURI from 'mini-svg-data-uri';

type Options = {
  output: string;
  useBase64?: boolean;
  useDataUrl?: boolean;
  getVariableName?: (
    options: FigmaExport.ComponentOutputterParamOption,
  ) => string;
};

export default ({
  output,
  getVariableName = (options): string =>
    camelCase(options.componentName.trim()),
  useBase64 = false,
  useDataUrl = false,
}: Options): FigmaExport.ComponentOutputter => {
  return async (pages): Promise<void> => {
    for (const { name: pageName, components } of pages) {
      let jsCode = '';

      for (const component of components) {
        const {
          name: componentName,
          svg,
          figmaExport,
          description,
          documentationLinks,
        } = component;

        const options = {
          pageName,
          componentName,
          ...figmaExport,
        };

        const variableName = getVariableName(options);
        let variableValue: string;

        if (/^[\d]+/.test(variableName)) {
          throw new Error(
            `"${componentName.trim()}" thrown an error: component names cannot start with a number.`,
          );
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
          throw new Error(
            `Component "${componentName}" has an error: two components cannot have a same name.`,
          );
        }

        const documentationLink = documentationLinks.map((link) => link.uri);

        const comment =
          description != null && description.trim() !== ''
            ? `/**\n * ${description}${documentationLink != null ? `\n * ${documentationLink.join('\n * ')}` : ''}\n */\n`
            : '';

        jsCode += `${comment}export const ${variableName} = \`${variableValue}\`;\n`;
      }

      const filePath = path.resolve(output, `${pageName}.js`);

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, jsCode);
    }
  };
};
