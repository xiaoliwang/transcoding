'use strict'

const R = require('ramda')
const { asyncSleep } = require('../lib/sync')
const socketIO = require('../lib/SocketServer')
const db = require('../lib/NedbConnection')

/**
 * 封装音频压缩状态相关操作
 */
class CompressInfo {
  /**
   * 获取客户端音频压缩状态
   *
   * @param {Number} requestID 请求 ID
   * @return {Object} 音频压缩状态，如：{ "233": 0.25, "234": 0.58 }
   * @throws Error 查询超过设置的时间时抛出异常
   */
  async getSoundStatus(requestID) {
    // 音频压缩状态
    let soundStatus = {}
    let MAX_QUERY_TIMES = 10
    // 已查询次数
    let queryTimes = 0
    while (queryTimes < MAX_QUERY_TIMES) {
      queryTimes++
      let data = await db.findOneASync({ request_id: requestID })
      if (data.info.length === socketIO.clients.length) {
        queryTimes = MAX_QUERY_TIMES + 1
        R.forEachObjIndexed((client) => {
          R.forEachObjIndexed((status, sound_id) => {
            soundStatus[sound_id] = status
          }, client.sounds)
        }, data.info)
        // 删除此条已无用的记录
        db.remove({ request_id: requestID })
      }
      await asyncSleep(2000)
    }
    if (queryTimes === MAX_QUERY_TIMES) {
      throw new Error('查询超时，请稍后再试')
    }
    return soundStatus
  }
}

module.exports = CompressInfo
