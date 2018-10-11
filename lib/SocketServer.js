'use strict'

const socketIo = require('socket.io')
const { findIndexByAttr } = require('../lib/Utils')
const db = require('../lib/NedbConnection')

class SocketIO {
  /**
   * 构造函数
   * 设定保存正在连接的客户端数组属性
   */
  constructor() {
    this.clients = []
  }

  /**
   * 启动 Socket 服务，监听端口
   *
   * @param {Koa} app
   * @param port Socket 服务监听的端口号
   */
  start(app, port) {
    let io = socketIo(app.listen(port))
    this.io = io
    // 客户端连接到服务端时执行的动作
    io.on('connection', (socket) => {
      this.socket = socket
      let client = {
        id: socket.id,
      }
      // 有新的客户端连接时，将其加入正在连接客户端数组：this.clients
      this.clients.push(client)
      // 通知客户端连接成功
      io.to(socket.id).emit('connect_success', socket.id)
      // 客户端下线处理，下线后将其移出正在连接客户端数组：this.clients
      socket.on('disconnect', () => {
        let index = findIndexByAttr('id', socket.id, this.clients)
        if (index !== -1) {
          // 若存在于在线列表，将其从在线列表中移除
          this.clients.splice(index, 1)
        }
      })
      // 保存客户端发送的压缩信息
      socket.on('save_compress_info', async (params) => {
        await db.updateASync({ request_id: params.requestID }, { $push: { info: params.data } })
      })
    })
  }

  /**
   * 通知客户端保存其正在压缩的音频状态
   *
   * @param {Number} requestID
   * @throws Error 没有客户端连接时抛出异常
   */
  getCompressInfo(requestID) {
    if (!this.socket || this.clients.length === 0) throw new Error('没有正在执行压缩任务的服务')
    this.io.emit('send_compress_info', requestID)
  }
}

module.exports = new SocketIO()
