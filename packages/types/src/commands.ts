import { StringTransformer, ComponentOutputter } from './global';
import { StyleOutputter } from './styles';

type ExportComponents = {
    fileId: string;
    onlyFromPages?: string[];
    transformers?: StringTransformer[];
    outputters?: ComponentOutputter[];
}

type ExportStyles = {
    fileId: string;
    outputters?: StyleOutputter[];
}

type ExportOptions = {
    token: string;
    log?: (msg: string) => void;
}

export type ExportComponentsOptions = ExportOptions & ExportComponents

export type ExportStylesOptions = ExportOptions & ExportStyles

export type CommandUseConfig = {
    commands: (['components', ExportComponents] | ['styles', ExportStyles])[]
}
