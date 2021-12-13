const fs = require('fs');
const path = require('path');

const filename = path.resolve('.', 'dist', 'index.html');
const index = fs.readFileSync(filename, 'utf-8');

fs.writeFileSync(filename, index.replace(/http:\/\/localhost:45678\//g, '/'));
