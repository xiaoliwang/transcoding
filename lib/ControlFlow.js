const async = require("async");
const Sound = require("../model/Sound");
const sync = require("../lib/sync");
const { getRow } = require("../lib/TestTool");
const logger = require("../lib/Logger");
const task_client = require("../component/TaskClient");

let start = 0;
let concurrent = 16;
let free_concurrent = 16;

// @TODO get concurrent number from configure
const q = async.queue(async (row) => {
    try {
        // @WORKAROUND 需要替换成压缩具体逻辑
        let new_row = await getRow(row);
        let sound = new Sound(row);
        await sound.compressSound();
        await task_client.finishTaskAsync(row.id);
        let task = await task_client.getTasksAsync(1);
        if (0 !== task.rows.length) {
            q.soundPush(task.rows);
        } else {
            ++free_concurrent;
        }
        return new_row.id;
    } catch(e) {
        logger.error(e);
    }
}, concurrent);

q.drain = function() {
    // @TODO 是否需要调整
    start = 0;
    free_concurrent = concurrent;
    console.log("finish", free_concurrent);
}

q.pushWrap = (cb) => { return (tasks) => q.push(tasks, cb) };
q.soundPush = q.pushWrap((err, id) => { logger.info(`sound ${id} compressed finished`) });

let locker = new sync.Locker();
q.start = async function() {
    console.log("执行", free_concurrent);
    if (free_concurrent >= 0) {
        locker.lock();
        let task = await task_client.getTasksAsync(free_concurrent);
        let rows = task.rows;
        if (0 === rows.length) return;
        free_concurrent -= rows.length; 
        console.log("start");
        q.soundPush(rows);
        locker.unlock();
    }
    
}

module.exports = q;