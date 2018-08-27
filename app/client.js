"use strict"

const q = require("../lib/ControlFlow");
const logger = require("../lib/Logger");
const { timing_task } = require("../lib/Utils");


async function startTask() {
    q.start();
}

timing_task(startTask, 2);

/*
function main() {
    q.timing_task(startTask, 4);
}

main();
*/
