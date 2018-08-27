"use strict"

const Koa = require("koa");
const grpc = require("grpc");
const command = require("../command/server");
const middleware = require("../middleware");
const { controller, serviceRegist} = require("../controller");

// 本地开始运行定时任务
command();

// 注册 web 请求中间件及 controller
const app = new Koa();
middleware(app);
controller(app);

app.on("error", (err, ctx) => {
    // @TODO 这边需要记录未捕获错误，并进行处理
});

// 注册 grpc 请求
const server = new grpc.Server();
serviceRegist(server);

// @TODO 端口和 ip 从配置文件中获取
app.listen(3000);
server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
server.start();