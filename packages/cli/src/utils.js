const fs = require('fs');
const path = require('path');

module.exports.mkdirRecursive = (dir) => {
    if (!fs.existsSync(dir)) {
        module.exports.mkdirRecursive(path.dirname(dir));
        fs.mkdirSync(dir);
    }
};
