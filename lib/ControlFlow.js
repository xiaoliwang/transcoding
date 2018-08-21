const async = require("async");
const Sound = require("../model/Sound");

let start = 0;

// @TODO get concurrent number from configure
const q = async.queue(async(row) => {
    let sound = new Sound(row);
    await sound.compressSound();
    return sound.id;
}, 4);

q.drain = function() {
    // @TODO 是否需要调整
    start = 0;
    console.log("finish");
}

q.start = function(tasks, cb) {
     if (1 === start) return;
     start = 1;
     q.push(tasks, cb);
}

module.exports = q;