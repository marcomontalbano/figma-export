import { FigmaExportType, FigmaExportPageNode } from '@figma-export/types';

export type OptionType = {
    componentName: string;
    pageName: string;
} & FigmaExportType;

export type TransformerType = (pages: Array<FigmaExportPageNode>) => Promise<void>;
export type OutputterType = (pages: FigmaExportPageNode[]) => Promise<void>;

export type OutputComponentsAsSvgOptionType = {
    output: string;
    getDirname?: (options: OptionType) => string;
    getBasename?: (options: OptionType) => string;
}
