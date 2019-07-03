const SVGO = require('svgo')

const AbstractTransformer = require('./AbstractTransformer')

module.exports = class extends AbstractTransformer {

    constructor(options = {}) {
        super(options);

        this.svgo = new SVGO(options);
    }

    async execute(svg) {
        return (await this.svgo.optimize(svg)).data
    }
}
