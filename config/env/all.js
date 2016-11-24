/* eslint-disable */
var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..');
let keys = `${rootPath}/keys.txt`;

module.exports = {
  root: rootPath,
  port: process.env.PORT,
  db: process.env.MONGODB_URL
};
