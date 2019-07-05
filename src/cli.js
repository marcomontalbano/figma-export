require('dotenv')

const meow = require('meow')
const ora = require('ora');

const fs = require('fs')
const path = require('path')

const utils = require('./utils')
const figma = require('./figma');

const cli = meow(`usage: figma-export <command> <file-id>

In order to use figma-export you need a valid Access Token.
$ export FIGMA_TOKEN=<figma-access-token>

These are all available <command>s:
    components      Exports components from a Figma file

Options:
    --output        Output directory (defaults to './output')
    --page          Figma page names (defaults to 'all pages')
    --transformer   Path to transform function
    --outputter     Path to outputter function
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
                alias: 'o',
                default: 'as-stdout'
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
        }).catch(err => {
            spinner.stop()
            console.error(err.message)
        })

        break;
}
