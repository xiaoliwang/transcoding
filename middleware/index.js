"use strict";

const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const winstonLogger = require("../lib/Logger");
const getRawBody = require('raw-body')
const validator = require('validator');
const { ENV } = require("../config/system");
const { hash_hmac, base64_decode } = require("../lib/Utils")
const { SECRET_KEY } = require("../config/key")
const { apiRecipient } = require('../config/backend');
const Email = require("../component/Email");

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
            if (ctx.body) return ctx.body = { success: true, info: ctx.body }
            ctx.body = { success: false, info: "Not Found" }
        } catch(e) {
            let msg = (typeof e === "object") ? e.message : e;
            if (ctx.response.status >= 500) {
                // 接口请求异常时记录到日志
                winstonLogger.error(msg);
                // 发送邮件通知管理员
                let email = new Email(apiRecipient);
                let subject = '音频转码后台接口请求异常';
                let content = `<b style="color: #6c9e71">[请求时间]</b></br>${new Date()}</br>
                    <b style="color: #9e534b">[错误信息]</b></br>${msg}</br>
                    <b style="color: #528690">[请求头信息]</b></br>${JSON.stringify(ctx.request)}`;
                email.send(subject, content);
            }
            ctx.body = {
                success: false,
                info: msg
            }
        }
    });

    // 处理 rpc 请求
    app.use(async (ctx, next) => {
        if (ctx.request.method === 'POST') {
            let body = await getRawBody(ctx.req, { encoding: true });
            body = parseBody(body);
            if (!body) {
                ctx.response.status = 403
                throw new Error('无权访问');
            }
            ctx.request.body = body;
        }
        await next();
    });

    app.use(bodyParser());

    return app;
}

/**
 * 解析 rpc 请求中的 body
 *
 * @param {String} body 要解析的字符串，格式：<encodeData> <sign> <timestamp>
 * @return {Object|null} 请求的参数
 */
function parseBody(body) {
    if (body && typeof body === 'string') {
        let parts = body.split(' ');
        if (parts.length === 3 && validator.isNumeric(parts[2])) {
            let rt = parseInt(parts[2]);
            let now = Math.floor(Date.now() / 1000);
            if (Math.abs(now - rt) < 100) {
                let encodeData = parts[0];
                let text = encodeData + ' ' + parts[2];
                // 验证 sign
                let hash = hash_hmac('sha256', text, SECRET_KEY);
                if (hash === parts[1]) {
                    return JSON.parse(base64_decode(encodeData));
                }
            }
        }
    }
    return null;
}

module.exports = middleware;