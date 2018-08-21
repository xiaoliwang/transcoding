const R = require("ramda");
const { getDB } = require("../lib/DBConnection");

const candidates = [];

async function getSounds() {
    let conn = await getDB();
    let sql = `SELECT id, user_id, duration, soundurl, checked FROM m_sound where checked = -1 order by id limit 10`;
    let rows = await conn.find(sql);
    return rows;
}

candidates.__proto__.update = async function() {
    let self = this;
    let rows = await getSounds();
    let time = new Date().getTime();
    for (let row of rows) {
        for (let sound of this) {
            if (row.id === sound.id) break;
        }
        row.time = time;
        row.run = 0;
        this.push(row);
    }
}

candidates.__proto__.getTasks = function(num) {
    let tasks = [];
    for (let sound of this) {
        if (!num) break;
        if (0 === sound.run) {
            sound.run = 1;
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