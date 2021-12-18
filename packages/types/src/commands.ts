import { StringTransformer, ComponentOutputter, PageNode } from './global';
import { StyleOutputter, Style } from './styles';

export type BaseCommandOptions = {
    token: string;
    log?: (msg: string) => void;
}

export type ComponentsCommandOptions = {
    fileId: string;
    version?: string;
    onlyFromPages?: string[];
    transformers?: StringTransformer[];
    outputters?: ComponentOutputter[];
    concurrency?: number;
}

export type StylesCommandOptions = {
    fileId: string;
    version?: string;
    outputters?: StyleOutputter[];
}

export type FigmaExportRC = {
    commands: (['styles', StylesCommandOptions] | ['components', ComponentsCommandOptions])[]
}

export type ComponentsCommand = (options: BaseCommandOptions & ComponentsCommandOptions) => Promise<PageNode[]>

export type StylesCommand = (options: BaseCommandOptions & StylesCommandOptions) => Promise<Style[]>
