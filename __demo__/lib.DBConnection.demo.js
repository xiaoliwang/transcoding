const { getDB } = require("../lib/DBConnection");

let conn;
async function start() {
    conn = await getDB();
    let sql = "select sleep(2), id from mowangskuser limit 1";
    console.log("starting");
    const [ rows, fields ] = await conn.execute(sql);
    console.log(rows);
    return conn;
}

Promise.all([start(), start(), start(), start()]).then((conns) => {
    console.log("finish");
    conn.end();
});