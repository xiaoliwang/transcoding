const { unlinkSync } = require("fs");
const { getSoundInfo, toMP3 } = require("../component/FFmpeg");

// 这里请替换成对应测试音频文件地址
let file_path = "./file/1.mp3";
let info = getSoundInfo(file_path);
/**
 *  默认 entries 会返回 duration 及 bit_rate
 *  其中 duration 的单位为 s, 转换为 s 时需要 x 1000
 *  bit_rate 的单位为 bps, 转换为 kbps 时需 / 1000
 */
console.log(info); // { duration: '759.902041', bit_rate: '192012' }

info = getSoundInfo(file_path, '');
console.log(info); // 这里会打印音频的所有信息。

let new_file_path = toMP3(file_path, 64);
info = getSoundInfo(new_file_path);
console.log(info); // 这里获取的 bit_rate 应该为 64xxx

// 清理生成的临时文件
unlinkSync(new_file_path);