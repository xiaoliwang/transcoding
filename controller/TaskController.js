"use strict";

function TaskController(router) {

    router.get("/ping", (ctx, next) => {
        ctx.body = "pong";
    });

    router.get("/error", (ctx, next) => {
        throw new Error("fuck");
    });

    return router;
}

module.exports = TaskController;