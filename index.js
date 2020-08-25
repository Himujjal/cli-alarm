const path = require("path");
const file = path.resolve(__dirname);

require = require("esm")(module /*, options*/);
module.exports = require(path.resolve(file, "./main.js"));
