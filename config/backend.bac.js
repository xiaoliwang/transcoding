module.exports = {
    transcodingErr: [], // 转码失败时通知用户的邮箱，如“['huateng@qq.com', 'dinglei@163.com']”
    apiErr: [], // 转码失败时通知用户的邮箱
    // QQ 机器人接口
    qqBot: {
        url: 'http://127.0.0.1:xxxx',
        messageType: 'group',
        groupId: 'xxx',
    }
}
