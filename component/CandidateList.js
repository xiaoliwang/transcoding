const R = require("ramda");
const { getDB } = require("../lib/DBConnection");
const { getData } = require("../lib/TestTool");

const candidates = [];

async function getSounds() {
    let conn = await getDB();
    let sql = `SELECT id, user_id, duration, soundurl, checked FROM m_sound where checked = -1 order by id limit 10`;
    let rows = await conn.find(sql);
    console.log(rows);
    
    return rows;
}

candidates.__proto__.update = async function() {
    let rows = await getSounds();
    let time = Math.floor(Date.now() / 1000);
    for (let row of rows) {
        for (let sound of this) {
            if (row.id === sound.id) break;
        }
        row.time = time;
        row.run = false;
        this.push(row);
    }
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

// @TODO get tasks from remote
// @TODO finish task from remote

module.exports = candidates;

// @WORKAROUND 监控代码
setInterval(() => {
    console.log(candidates);
    console.log("\n\n");
}, 5000);