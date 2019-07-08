const SVGO = require('svgo')

module.exports = options => {
    const svgo = new SVGO(options);
    return async svg => {
        return (await svgo.optimize(svg)).data
    }
}
