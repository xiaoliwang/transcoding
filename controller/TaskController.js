"use strict";

const candidates = require("../component/CandidateList")
const socketIO = require('../lib/SocketServer')
const db = require('../lib/NedbConnection')
let CompressInfo =  require('../model/CompressInfo')

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

    /**
     * 获取音频压缩情况
     *
     * @todo 需要对请求来源进行验证
     */
    router.get('/get-compress-info', async ctx => {
      // 生成 requestID
      let requestID = Date.now() + Math.random().toString(36).substring(2, 4)
      let compressInfo = new CompressInfo()
      // 创建一条存储本次请求的压缩信息的数据库记录
      await db.insertASync({ request_id: requestID, info: [] })
      // 通知“压缩客户端”存入音频压缩状态
      socketIO.getCompressInfo(requestID)
      // 获取全部客户端正在压缩音频的状态
      ctx.body = await compressInfo.getSoundStatus(requestID)
    })

    return router;
}

module.exports = TaskController;