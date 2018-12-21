"use strict"

const mysql = require("mysql2/promise");
const { mysql: config } = require("../config/db");
const { Once, Locker, asyncSleep } = require("./sync");
const logger = require("./Logger");

let conn;
let once = new Once;
let locker = new Locker();
// 数据库重连次数
let connectTime = 0;

// 缓存斐波那契数列
let feboTemp = [1, 1];

/**
 * 获得斐波那契数列的数值
 *
 * @param n 需要的数值索引
 * @return {number} 返回对应索引的数值
 */
function fibo(n) {
    let result = feboTemp[n];
    if(typeof result !== 'number') {
        // 若缓存中无结果，则进行计算
        result = fib(n - 1) + fib( n - 2);
        feboTemp[n] = result
    }
    return result;
}

function getConnectTime(){
    if (0 === connectTime) {
        return 0;
    } else if (connectTime > 18) {
        // 若重连次数超过 18 次，即重连时间超过 2584 秒，则下次重连时间保持 1 小时
        return 3600;
    } else if (connectTime === 18) {
        return 3600;
    }
    return fibo(connectTime);
}

let init = async function() {
    conn = await mysql.createConnection(config);
    conn.find = async function(...params) {
        let [rows, fields] = await conn.execute(...params);
        return rows;
    };

    conn.findOne = async function(...params) {
        let [rows, fields] = await conn.execute(...params);
        return rows[0] || null; 
    }
    conn.on('error', async (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            // 如果是连接断开，自动重新连接
            locker.lock();
            logger.info('数据库断开连接并自动重连');
            let time = getConnectTime()
            await asyncSleep(time);
            await init();
            locker.unlock();
        } else {
            logger.error(err);
        }
    });
}

async function getDB() {
    await once.do(init);
    return conn;
}

exports.getDB = getDB;