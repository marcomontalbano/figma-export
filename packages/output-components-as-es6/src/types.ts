import { FigmaExportType } from '@figma-export/types';

export type OptionType = {
    componentName: string;
    pageName: string;
} & FigmaExportType;


export type PageType = {
    id: string;
    name: string;
    type: string;
    components: ComponentType[];
};

export type ComponentType = {
    name: string;
    svg: string;
    figmaExport: FigmaExportType;
}

export type TransformerType = (pages: Array<PageType>) => Promise<void>;
export type OutputterType = (pages: PageType[]) => Promise<void>;

export type OutputComponentsAsEs6OptionType = {
    output: string;
    useBase64?: boolean;
    useDataUrl?: boolean;
    getVariableName?: (options: OptionType) => string;
}
