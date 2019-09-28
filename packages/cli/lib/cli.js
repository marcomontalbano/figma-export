const meow = require('meow');
const ora = require('ora');

const fs = require('fs');
const path = require('path');

const figma = require('@figma-export/core');

const cli = meow(`usage: figma-export <command> <file-id>

In order to use figma-export you need a valid Access Token.
$ export FIGMA_TOKEN=<figma-access-token>

These are all available <command>s:
    components      Exports components from a Figma file

Options:
    -p, --page          Figma page names (defaults to 'all pages')
    -o  --output        Output directory (defaults to './output')
    -O, --outputter     Path to outputter function
    -t, --transformer   Path to transform function
`,
{
    flags: {
        output: {
            type: 'string',
            default: 'output',
            alias: 'o',
        },
        page: {
            type: 'string',
            alias: 'p',
        },
        transformer: {
            type: 'string',
            alias: 'T',
        },
        outputter: {
            type: 'string',
            alias: 'O',
            default: '@figma-export/output-components-as-stdout',
        },
    },
});

const resolveNameOrPath = (objs = []) => {
    const objsAsArray = Array.isArray(objs) ? objs : [objs];

    return objsAsArray.map((nameOrPath) => {
        const absolutePath = path.resolve(nameOrPath);
        return fs.existsSync(absolutePath) ? absolutePath : nameOrPath;
    });
};

const [command, fileId] = cli.input;

const output = path.resolve(cli.flags.output);

const options = {
    ...cli.flags,
    output,
    transformer: resolveNameOrPath(cli.flags.transformer),
    outputter: resolveNameOrPath(cli.flags.outputter),
};

figma.setToken(process.env.FIGMA_TOKEN);

const spinner = ora();

switch (command) {
case 'components':
    spinner.start();

    figma.exportComponents(fileId, {
        output: options.output,
        onlyFromPages: options.page,
        transformers: options.transformer,
        outputters: options.outputter,
        updateStatusMessage: (message) => { spinner.text = message; },
    }).then(() => {
        spinner.stop();
    }).catch((err) => {
        spinner.stop();

        // eslint-disable-next-line no-console
        console.error(err.message);
    });

    break;
default:
    break;
}
