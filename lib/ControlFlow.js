const async = require("async");
const Sound = require("../model/Sound");
const sync = require("../lib/sync");
const logger = require("../lib/Logger");
const task_client = require("../component/TaskClient");
const { compression_concurrent: concurrent } = require("../config/runtime")

let start = 0;
let free_concurrent = concurrent;

const q = async.queue(async (row) => {
    try {
        let sound = new Sound(row);
        await sound.compressSound();
        await task_client.finishTaskAsync({ id: row.id});
        let task = await task_client.getTasksAsync({ num: 1 });
        if (0 !== task.rows.length) {
            q.soundPush(task.rows);
        } else {
            ++free_concurrent;
        }
        return sound.id;
    } catch(e) {
        logger.error(e);
    }
}, concurrent);

q.drain = function() {
    // @TODO 是否需要调整
    start = 0;
    free_concurrent = concurrent;
    logger.info("该批任务完成", free_concurrent);
}

q.pushWrap = (cb) => { return (tasks) => q.push(tasks, cb) };
q.soundPush = q.pushWrap((err, id) => { logger.info(`sound ${id} compressed finished`) });

let locker = new sync.Locker();
q.start = async function() {
    if (free_concurrent >= 0) {
        locker.lock();
        try {
            let task = await task_client.getTasksAsync({ num: free_concurrent });
            let rows = task.rows;
            if (0 === rows.length) {
                return;
            }
            free_concurrent -= rows.length;
            q.soundPush(rows);
        } catch (e) {
            logger.error(`client 获取转码任务异常：${e.stack || e}`);
        } finally {
            locker.unlock();
        }
    }
}

module.exports = q;