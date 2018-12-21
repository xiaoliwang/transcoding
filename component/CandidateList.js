const R = require("ramda");
const { getDB } = require("../lib/DBConnection");
const { findIndexByAttr } = require("../lib/Utils");

// 音频按直播（catalog_id 为 80）与非直播类型进行分组
const groupByCatalog = R.groupBy((sound) => {
    return sound.catalog_id === 80  ? 'live' : 'other';
})

const candidates = [];

async function getSounds() {
    let conn = await getDB();
    // 任务队列最大任务数量
    let MAX_COUNT = 50;
    let sql = `SELECT id, user_id, duration, soundurl, checked, source, catalog_id FROM m_sound WHERE checked = -1
        ORDER BY id LIMIT 1000`;
    let sounds = await conn.find(sql);
    needCount = MAX_COUNT - candidates.length;
    if (0 === needCount) {
        // 若任务队列满额，则不添加新的任务
        return [];
    }
    // 按转码优先级对查询结果进行排序
    sounds = order(sounds)
    sounds = sounds.slice(0, needCount)
    return sounds;
}

/**
 * 按转码优先级对查询结果进行排序
 * 当前排序方式为直播分类放在最后，其他分类按照原创先于搬运进行排序
 *
 * @param {Sound[]} sounds 查询出来的音频对象组成的数组
 * @return {Sound[]} 排序好以后的数组
 */
function order(sounds) {
    let newSounds = [];
    for (sound of sounds) {
        if (-1 === findIndexByAttr('id', sound.id, candidates)) {
            newSounds.push(sound);
        }
    }
    if (0 === newSounds.length) {
        return [];
    }
    let newSoundGroup = groupByCatalog(newSounds)
    let liveSounds = newSoundGroup.live || [];
    let otherSounds = newSoundGroup.other || [];
    otherSounds = R.sort(R.descend(R.prop('source')), otherSounds);
    return R.concat(otherSounds, liveSounds);
}

/**
 * 根据 ID 获取音频相关信息
 *
 * @param {Number} id 音频 ID
 * @return {Object} 音频信息组成的对象
 * @throws Error 连接数据库失败时抛出异常
 */
async function getSound(id) {
  let conn = await getDB();
  let sql = `SELECT id, user_id, duration, soundurl, checked FROM app_missevan.m_sound WHERE id = ${id}`
  let row = await conn.findOne(sql);
  return row;
}

candidates.__proto__.update = async function() {
    let rows = await getSounds();
    let time = Math.floor(Date.now() / 1000);
    for (let row of rows) {
        row.time = time;
        row.run = false;
        addTask(row, false);
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

/**
 * 新增压缩任务
 *
 * @param {Sound} sound 音频对象
 * @param {Boolean} isTop 是否添加到队列头
 */
function addTask(sound, isTop){
    let index = findIndexByAttr('id', sound.id, candidates)
    if (index > -1) {
      if (candidates[index].run || !isTop) {
        // 当音频已压缩或不需要置顶时，不做改动
        return
      }
      sound = candidates[index]
      // 删除原来的元素再进行插入，避免删除前就被取出的情况
      candidates.splice(index, 1)
      candidates.unshift(sound)
    } else {
      // 当音频不在压缩数组队列中时，将其加入队列
      sound.time = Math.floor(Date.now() / 1000)
      sound.run = false
      if (isTop) {
        candidates.unshift(sound)
      } else {
        candidates.push(sound);
      }
    }
}

candidates.__proto__.finishTask = function(id) {
    let index = findIndexByAttr('id', id, this)
    if (-1 === index) return false;
    this.splice(index, 1);
    return true;
}

/**
 * 置顶指定的音频
 *
 * @param {Number} id 音频 ID
 * @return {boolean} 是否置顶成功
 * @throws 音频不存在或已转码时抛出异常
 */
candidates.__proto__.topSound = async function (id) {
    let sound = await getSound(id)
    if (!sound) {
        throw new Error('该音频不存在或已转码')
    }
    // 将音频加入压缩任务队列头
    addTask(sound, true)
}

module.exports = candidates;
