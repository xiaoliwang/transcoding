const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const { promisify } = require("util");

/**
 * 获取对应路径文件名
 * 
 * @param {string} file_path 文件路径
 * @param {boolean} with_ext 是否需要后缀
 * 
 * @returns {string} 路径名
 */
function getFileName(file_path, with_ext = true) {
    const ext = with_ext ? '' : path.extname(file_path);
    return path.basename(file_path, ext);
}

function mkdirSync(dir_path) {
    if (!fs.existsSync(path)) {
        mkdirp.sync(dir_path);
        return true;
    }
    return false;
}

// 这边使用 fs.unlinkSync 会发生阻塞，效率较低
let unlinkPromise = promisify(fs.unlink)
async function unlinkAsync(path) {
    if (fs.existsSync(path)) {
        await unlinkPromise(path);
        return true;
    }
    return false;
}

exports.getFileName = getFileName;
exports.mkdirSync = mkdirSync;
exports.unlinkAsync = unlinkAsync;