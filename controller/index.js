"use strict";

const path = require("path");
const Router = require("koa-router");
const TaskController = require("./TaskController")
const { packageDefinition, services } = require("./TaskProto");

function controller(app) {
    let task_router = TaskController(new Router({ prefix: '/task' }));
    app.use(task_router.routes());
    return app;
}

function serviceRegist(server) {
    server.addService(packageDefinition.Task.service,
        services);
}

exports.controller = controller;
exports.serviceRegist = serviceRegist;