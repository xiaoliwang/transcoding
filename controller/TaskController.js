"use strict";

const candidates = require("../component/CandidateList")
const CompressInfo =  require('../model/CompressInfo')

function TaskController(router) {

    router.get("/ping", (ctx, next) => {
        ctx.body = "pong";
    });

    router.get("/error", (ctx, next) => {
        ctx.response.status = 500;
        throw new Error("fuck");
    });

    /**
     * 将音频优先进行压缩
     *
     * @param {Number} id 音频 ID
     */
    router.post('/transcode-sound', async (ctx, next) => {
      let soundId = parseInt(ctx.request.body.id);
      if (isNaN(soundId) || soundId <= 0) throw new Error('参数错误');
      // 执行置顶操作
      await candidates.topSound(soundId);
      ctx.body = '音频已成功加入压缩队列队首';
    })

    /**
     * 获取音频压缩情况
     */
    router.post('/get-transcoding-info', async ctx => {
      let compressInfo = new CompressInfo();
      // 获取全部客户端正在压缩音频的状态
      ctx.body = await compressInfo.getSoundStatus();
    })

    return router;
}

module.exports = TaskController;