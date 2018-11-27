const R = require('ramda');
const crypto = require('crypto');

function timing_task(func, seconds) {
    let delay = seconds * 1000;
    func();
    setInterval(func, delay);
}

/**
 * 通过数组中某个元素（对象）的属性值查找元素在数组中的索引位置
 *
 * @param {String} attrName 属性名
 * @param {mixed} attrValue 属性值
 * @param {Object[]} array 多个对象组成的数组
 * @return int 对应元素在数组中的索引位置，若不存在返回 -1
 */
function findIndexByAttr(attrName, attribute, array) {
    return R.findIndex(R.propEq(attrName, attribute))(array);
}

/**
 * base64 加密
 *
 * @param {String} str 需要加密的字符串
 * @return {String} 已加密的字符串
 */
function base64_encode(str) {
    return new Buffer(str).toString('base64');
}

/**
 * base64 解密（以 utf-8 编码解密）
 *
 * @param {String} str 需要解密的字符串
 * @return {String} 已解密的字符串
 */
function base64_decode(str) {
    return new Buffer(str, 'base64').toString('utf8');
}

/**
 * 使用 hash 加密
 *
 * @param {String} algorithm 加密算法名  (i.e. "md5", "sha256", "haval160,4", etc..)
 * @param {String} data 需要进行加密的信息
 * @param {String} key 加密密钥
 * @return {Buffer | string}
 */
function hash_hmac(algorithm, data, key) {
    return crypto.createHmac(algorithm, key).update(data).digest('hex');
}

exports.timing_task = timing_task;
exports.findIndexByAttr = findIndexByAttr;
exports.hash_hmac = hash_hmac;
exports.base64_decode = base64_decode;
exports.base64_encode = base64_encode;
