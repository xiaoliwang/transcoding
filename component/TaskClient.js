"use strict"

const path = require("path");
const grpc = require("grpc");
const { promisify } = require("util");
const { PROTO_ROOT } = require("../config/system");
const logger = require("../lib/Logger");

let PROTO_PATH = path.join(PROTO_ROOT, "task.proto");
let task_proto = grpc.load(PROTO_PATH).compression;

// @TODO 从配置文件中获取 ip 和端口
let client = new task_proto.Task('localhost:50051',
    grpc.credentials.createInsecure());

client.getTasksAsync = promisify(client.getTasks);
client.finishTaskAsync = promisify(client.finishTask);

module.exports = client;