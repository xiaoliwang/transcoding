"use strict"

const candidates = require("../component/CandidateList");
const { timing_task } = require("../lib/Utils");
const { SERVERINTERVAL } = require("../config/runtime")

function startTask() {
    timing_task(() => candidates.update(), SERVERINTERVAL);
}

module.exports = startTask;