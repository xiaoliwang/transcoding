const R = require('ramda');

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

exports.timing_task = timing_task;
exports.findIndexByAttr = findIndexByAttr;
