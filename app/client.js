"use strict"

const q = require("../lib/ControlFlow");
const logger = require("../lib/Logger");
const { timing_task } = require("../lib/Utils");
const { CLIENTINTERVAL, SOCKETCONF } = require("../config/runtime")
const socketClient = require('../lib/SocketClient')

// @todo: 端口需要从配置中读取
socketClient.connect(SOCKETCONF.ip, SOCKETCONF.port, data => {
  // 连接成功以后开始定时压缩任务
  timing_task(startTask, CLIENTINTERVAL)
})

async function startTask() {
    q.start();
}
