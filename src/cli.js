require('dotenv')

const meow = require('meow')
const ora = require('ora');

const fs = require('fs')
const path = require('path')

const utils = require('./utils')
const figma = require('./figma');

const cli = meow(
    `
  figma-export
  $ figma-export components <file-id>
  Options
  --output       output directory (defaults to './output')
  --page         figma page name (defaults to 'all pages')
  --transformer  path to transform function
  --outputter    path to outputter function
  `,
    {
        flags: {
            output: {
                type: 'string',
                default: 'output'
            },
            page: {
                type: 'string',
                alias: 'p',
            },
            transformer: {
                type: 'string',
                alias: 't'
            },
            outputter: {
                type: 'string',
                alias: 'o'
            }
        },
    },
)

const resolveNameOrPath = objs => {
    return utils.toArray(objs).map(nameOrPath => {
        let absolutePath = path.resolve(nameOrPath);
        return fs.existsSync(absolutePath) ? absolutePath : nameOrPath;
    })
}

const [cli_command, cli_fileId] = cli.input

const output = path.resolve(cli.flags.output);

const cli_options = {
    ...cli.flags,
    output,
    transformer: resolveNameOrPath(cli.flags.transformer),
    outputter: resolveNameOrPath(cli.flags.outputter)
}

if (!fs.existsSync(output)) {
    const err = new Error(`Folder '${output}' doesn't exist`)
    throw err
}

figma.setToken(process.env.FIGMA_TOKEN);

switch (cli_command) {

    case 'components':
        const spinner = ora('Loading unicorns').start();

        figma.exportComponents(cli_fileId, {
            output: cli_options.output,
            onlyFromPages: cli_options.page,
            transformers: cli_options.transformer,
            outputters: cli_options.outputter,
            updateStatusMessage: message => spinner.text = message
        }).then(() => {
            spinner.stop()
        }).catch(err => console.error(err.message));

        break;
}
