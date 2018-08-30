"use strict"

const q = require("../lib/ControlFlow");
const logger = require("../lib/Logger");
const { timing_task } = require("../lib/Utils");
const { CLIENTINTERVAL } = require("../config/runtime")


async function startTask() {
    q.start();
}

timing_task(startTask, CLIENTINTERVAL);