import { FigmaExportType, FigmaExportPageNode } from '@figma-export/types';

export type OptionType = {
    componentName: string;
    pageName: string;
} & FigmaExportType;

export type TransformerType = (pages: Array<FigmaExportPageNode>) => Promise<void>;
export type OutputterType = (pages: FigmaExportPageNode[]) => Promise<void>;

export type OutputComponentsAsSvgstoreOptionType = {
    output: string;
    options?: {};
    getIconId?: (options: OptionType) => string;
}
