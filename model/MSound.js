"use strict";
const path = require("path");
const { getDB } = require("../lib/DBConnection");
const { TEMP_PATH } = require("../config/system");
const { getFileName, mkdirSync } = require("../lib/MyFile");
const logger = require("../lib/Logger");
const oss = require("../component/OSS");
const ffmpeg = require("../component/FFmpeg");

class Sound {

    constructor({id, user_id, duration, soundurl, checked}) {
        this.id = id;
        this.user_id = user_id;
        this.duration = duration;
        this.sound_url = soundurl;
        this.checked = checked;

        this.file_name = getFileName(soundurl);
        this.local_path = path.join(TEMP_PATH, this.file_name);

        let dir = path.dirname(soundurl);
        this.relative_remote_path = path.join(dir, getFileName(soundurl, false) + ".mp3");    
    }

    async download() {
        let remote_path = `sound/${this.sound_url}`;
        let dir = path.dirname(this.local_path);
        await mkdirSync(dir);
        let result = await oss.get(remote_path, this.local_path);
        return this.local_path;
    }

    async compressSound() {
        try {
            let local_path = await this.download();
            let info = ffmpeg.getSoundInfo(local_path);
            if (!info.bit_rate) throw new Error(`sound ${sound.id} is not a good sound`);
            let bit_rate = Math.round(info.bit_rate / 1000, 0);
            let schemes = ffmpeg.getSchemes(bit_rate);
            for (let scheme of schemes) {
                let output_file = ffmpeg.toMP3(local_path, scheme.rate);
                let remote_path = path.join(scheme.dir, this.relative_remote_path);
            }
            logger.info(`sound ${this.id} compressed successed`);
        } catch(e) {
            logger.error(`the error sound_id is ${this.id}。reason is ${e.message}`);
        } finally {

        }
    }
}

async function getSounds() {
    console.log("starting");
    let conn = await getDB();
    let sql = "SELECT id, user_id, duration, soundurl, checked FROM m_sound where source = 1 and id > 1 limit 1";
    const [rows, fields] = await conn.execute(sql);
    let sound = new Sound(rows[0]);
    await sound.compressSound();
    conn.end();
}

getSounds().catch((e) => {console.log(e)});