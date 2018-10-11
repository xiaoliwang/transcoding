"use strict"

const Koa = require("koa");
const grpc = require("grpc");
const middleware = require("../middleware");
const { controller, serviceRegist} = require("../controller");
const command = require("../command/server");
const logger = require("../lib/Logger");
const { WEBCONF, GRPCCONF, SOCKETCONF } = require("../config/runtime");
const socketIO = require('../lib/SocketServer')

// 本地开始运行定时任务
command();

// 注册 web 请求中间件及 controller
const app = new Koa();

// 启动 socketIO 服务并监听端口
socketIO.start(app, SOCKETCONF.port)

middleware(app);
controller(app);

app.on("error", (err, ctx) => {
    // @TODO 这边如果获取错误，需要进行处理
    logger.error(err);
});

// 注册 grpc 请求
const server = new grpc.Server();
serviceRegist(server);

app.listen(WEBCONF.port || 3000, WEBCONF.ip || "0.0.0.0");
server.bind(`${GRPCCONF.ip || "0.0.0.0"}:${GRPCCONF.port || 50051}`, grpc.ServerCredentials.createInsecure());
server.start();
