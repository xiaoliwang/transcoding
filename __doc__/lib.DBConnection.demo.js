const mysql = require("mysql2/promise");
const { mysql: config } = require("../config/db");

async function exec(conn) {
    let sql = "select sleep(2), id from mowangskuser limit 1";
    console.log("start query mission");
    const [ rows, fields ] = await conn.execute(sql);
    console.log(rows);
    return conn;
}

async function main() {
    let conn = await mysql.createConnection(config);
    let index  = 4;
    let sql = "select sleep(2), id from mowangskuser limit 1";
    const [ rows, fields ] = await conn.execute(sql);
    console.log(rows);
   
    let execs = [];
    while (index--) {
        execs.push(exec(conn));
    }

    Promise.all(execs).then(() => {
        console.log("finish");
        conn.end();
    })
}

main();