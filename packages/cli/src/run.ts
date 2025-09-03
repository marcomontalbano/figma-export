import Module from 'node:module';
import ora from 'ora';
import sade from 'sade';
import { addComponents } from './commands/components.js';
import { addStyles } from './commands/styles.js';
import { addUseConfig } from './commands/use-config.js';

const require = Module.createRequire(import.meta.url);

const pkg = require('../package.json');

const prog = sade('figma-export');

const spinner = ora({});

prog.version(pkg.version);

addUseConfig(addStyles(addComponents(prog, spinner), spinner), spinner).parse(
  process.argv,
);
