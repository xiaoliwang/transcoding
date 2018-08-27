const candidates = require("../component/CandidateList");
const { timing_task } = require("../lib/Utils");

// @TODO 从 configure 中获取周期时间
function startTask() {
    timing_task(() => candidates.update(), 10);
}

module.exports = startTask;