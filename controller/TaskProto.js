const path = require("path");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const { PROTO_ROOT } = require("../config/system");
const candidates = require("../component/CandidateList");

const PROTO_PATH = path.join(PROTO_ROOT, "task.proto");
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
});

let task_proto = grpc.loadPackageDefinition(packageDefinition).compression;

function getTasks(call, callback) {
    let err = null;
    let resp;
    try {
        let num = call.request.num;
        resp = { rows: candidates.getTasks(num) };
    } catch (e) {
        err = e;
    } finally {
        callback(err, resp);
    }
}

function finishTask(call, callback) {
    let err = null;
    let resp;
    try {
        let id = call.request.id;
        resp = { status: candidates.finishTask(id) };
    } catch (e) {
        err = e;
    } finally {
        callback(err, resp);
    }
}

exports.packageDefinition = task_proto;
exports.services = { getTasks, finishTask };