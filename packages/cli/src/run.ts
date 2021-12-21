import sade from 'sade';
import ora from 'ora';

import { addComponents } from './commands/components';
import { addStyles } from './commands/styles';
import { addUseConfig } from './commands/use-config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

const prog = sade('figma-export');

const spinner = ora({});

prog.version(pkg.version);

addUseConfig(addStyles(addComponents(prog, spinner), spinner), spinner)
    .parse(process.argv);
