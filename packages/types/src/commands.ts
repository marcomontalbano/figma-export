import { StringTransformer, ComponentOutputter } from './global';
import { StyleOutputter } from './styles';

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
