"use strict"

const path = require("path");
const grpc = require("grpc");
const { promisify } = require("util");
const protoLoader = require("@grpc/proto-loader");
const { PROTO_ROOT } = require("../config/system");
const { GRPCCONF } = require("../config/runtime");
const logger = require("../lib/Logger");

let PROTO_PATH = path.join(PROTO_ROOT, "task.proto");
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
const task_proto = grpc.loadPackageDefinition(packageDefinition).compression;

let client = new task_proto.Task(`${GRPCCONF.ip || "0.0.0.0"}:${GRPCCONF.port || 50051}`,
    grpc.credentials.createInsecure());


client.getTasksAsync = promisify(client.getTasks);
client.finishTaskAsync = promisify(client.finishTask);

module.exports = client;