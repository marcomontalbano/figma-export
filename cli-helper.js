const meow = require('meow')

const fs = require('fs')
const path = require('path')

const utils = require('./src/utils')

const cli = meow(
    `
  figmae
  $ figmae components <file-id>
  Options
  --output       output directory (defaults to './output')
  --page         figma page name (defaults to 'all pages')
  --transformer  path to transform function
  `,
    {
        flags: {
            output: {
                type: 'string',
                alias: 'o',
                default: 'output'
            },
            page: {
                type: 'string',
                alias: 'p',
            },
            transformer: {
                type: 'string',
                alias: 't'
            }
        },
    },
)

const constructFromString = objs => {
    return utils.toArray(objs).map(relativePath => {
        let absolutePath = path.resolve(relativePath);
        absolutePath = fs.existsSync(absolutePath) ? absolutePath : path.resolve(__dirname, 'src', 'transformers', `${relativePath}.js`)
        const Obj = require(absolutePath);
        const configBasename = `.${path.basename(absolutePath).replace('.js', '.json')}`;
        const configPath = path.resolve(configBasename);
        const options = fs.existsSync(configPath) ? require(configPath) : {};
        return new Obj(options);
    })
}

const [command, source] = cli.input

const options = {
    ...cli.flags,
    output: path.resolve(cli.flags.output),
    transformer: constructFromString(cli.flags.transformer)
}

if (!fs.existsSync(options.output)) {
    const err = new Error(`Folder '${options.output}' doesn't exist`)
    throw err
}

module.exports = {
    flags: cli.flags,
    command,
    source,
    options
}
