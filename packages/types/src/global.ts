export type FigmaExportType = {
    dirname: string;
    basename: string;
}

export type FigmaExportComponentNode = ComponentNode & {
    figmaExport: FigmaExportType;
    svg: string;
}

export type FigmaExportPageNode = PageNode & {
    components: FigmaExportComponentNode[];
};
