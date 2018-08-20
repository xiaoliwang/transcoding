let OSS = require('ali-oss');
let { oss: config } = require("../config/aliyun");

let client = new OSS(config);

module.exports = client;