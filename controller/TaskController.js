"use strict";

const candidates = require("../component/CandidateList")

function TaskController(router) {

    router.get("/ping", (ctx, next) => {
        ctx.body = "pong";
    });

    router.get("/error", (ctx, next) => {
        throw new Error("fuck");
    });

    /**
     * 将音频优先进行压缩
     *
     * @param {Number} id 音频 ID
     * @todo 需要对请求来源进行验证
     */
    router.post('/compress-sound', async (ctx, next) => {
      let soundId = parseInt(ctx.request.body.id)
      if (soundId <= 0) throw new Error('参数错误')
      // 执行置顶操作
      await candidates.topSound(soundId)
      ctx.body = '音频已成功加入压缩队列队首'
    })
    return router;
}

module.exports = TaskController;