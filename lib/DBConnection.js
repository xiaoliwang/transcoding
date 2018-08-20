const mysql = require("mysql2/promise");
const { mysql: config } = require("../config/db");
const { Once } = require("./sync");
const logger = require("./Logger");



let conn;
let once = new Once;

let init = async function() {
    conn = await mysql.createConnection(config);
    conn.on("error", (err) => {
        logger.error(err);
    });
}


async function getDB() {
    await once.do(init);
    return conn;
}

exports.getDB = getDB;