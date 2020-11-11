const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);

function exec(app) {
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach(file => { app.use(`/api/${file.replace(/\.js$/, '')}`, require(path.join(__dirname, file))) })
}

module.exports = exec