const q = require("./lib/ControlFlow");
const logger = require("./lib/Logger");
const candidates = require("./component/CandidateList");

function timing_task(func, seconds) {
    let delay = seconds * 1000;
    func();
    setInterval(func, delay);
}

function startTask() {
    let cb = (err, id) => {
        logger.info(`sound ${id} compressed finished`);
        candidates.finishTask(id);
        let task = candidates.getTask(1);
        q.push(task, cb);
    }
    let tasks = candidates.getTask(4);
    q.start(tasks, cb);
}

function main() {
    // TODO 区分 master 和 slave
    timing_task(() => candidates.update(), 30);
    timing_task(startTask, 4);
}


main();