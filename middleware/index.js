"use strict";

const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const { ENV } = require("../config/system");

function middleware(app) {
    app.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.set('X-Response-Time', `${ms}ms`);
    });

    if ("dev" === ENV) {
        app.use(logger());
    } else {
        app.use(logger((str, args) => {
            // @TODO 这里需要对生产环境进行处理
        }));
    }

    // 错误处理
    app.use(async (ctx, next) => {
        try {
            await next();
            console.log(ctx.response.status);
            if (ctx.body) return ctx.body = { success: true, info: ctx.body }
            ctx.body = { success: false, info: "Not Found" }
        } catch(e) {
            console.log(ctx.response.status);
            // @TODO 报错需要发送邮件
            let msg = (typeof e === "object") ? e.message : e;
            ctx.body = {
                success: false,
                info: msg
            }
        }
    });

    app.use(bodyParser());

    return app;
}

module.exports = middleware;