const R = require("ramda");
const { getDB } = require("../lib/DBConnection");

const candidates = [];

async function getSounds() {
    let conn = await getDB();
    // @WORKAROUND 这边查询代码需要进一步调整
    let sql = `SELECT id, user_id, duration, soundurl, checked FROM m_sound where checked = -1 order by id limit 5`;
    let rows = await conn.find(sql);
    return rows;
}

candidates.__proto__.update = async function() {
    let rows = await getSounds();
    let time = Math.floor(Date.now() / 1000);
    new_elem:
    for (let row of rows) {
        for (let sound of this) {
            if (row.id === sound.id) continue new_elem;
        }
        row.time = time;
        row.run = false;
        this.push(row);
    }
    // @TODO 这里需要对任务优先级进行处理
}

candidates.__proto__.getTasks = function(num) {
    let tasks = [];
    for (let sound of this) {
        if (num <= 0) break;
        if (false === sound.run) {
            sound.run = true;
            tasks.push(sound);
            num--;
        }
    }
    return tasks;
}

candidates.__proto__.finishTask = function(id) {
    let index = R.findIndex(R.propEq("id", id))(this);
    if (-1 === index) return false;
    this.splice(index, 1);
    return true;
}

module.exports = candidates;

// @WORKAROUND 监控代码
setInterval(() => {
    console.log(candidates);
    console.log("\n\n");
}, 5000);