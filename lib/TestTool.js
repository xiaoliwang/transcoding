const { asyncFunc } = require("../lib/sync");
const random = require("../lib/random");

async function getData() {
    let ms = random.getRandomInt(5000, 7000);
    let num = random.getRandomInt(5, 16);
    let data = [];
    while (num--) {
        data.push({
            id: random.getRandomInt(1, 100)
        })
    }
    return asyncFunc(ms, data);
}

async function getRow(row) {
    let ms = random.getRandomInt(500, 1000);
    return asyncFunc(ms, row);
}

exports.getData = getData;
exports.getRow = getRow;