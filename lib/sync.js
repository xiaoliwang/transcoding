"use strict";
const asyncSleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const asyncFunc = (ms, value = "value") => new Promise(resolve => setTimeout(() => {resolve(value)}, ms));
const nextTick = () => new Promise(resolve => setImmediate(resolve));

class SyncError extends Error {
    constructor(message) {
        super(message);
        this.name = "SyncError";
    }
}

/**
 * Creates a new Locker
 * @class
 */
function Locker() {
    let locked = 0;

    this.lock = async function() {
        if (1 === locked) {
            while (1 === locked) {
                await nextTick();
            }
        }
        locked = 1;
    };

    this.unlock = function() {
        if (1 === locked) {
            locked = 0;
        } else {
            throw new SyncError("sync: unlock of unlocked locker");
        }
    };
}

/**
 * Creates a Once object that will perform exactly one action
 * @class
 */
function Once() {
    let done = 0;
    let locker = new Locker();

    this.do = async function(func) {
        if (1 === done) return;
        try {
            await locker.lock()
            if (0 === done) {
                await func()
                done = 1;
            }
        } catch (e) {
            throw new Error(e.message);
        } finally {
            locker.unlock()
        }
    };
}

exports.Once = Once;
exports.Locker = Locker;
exports.nextTick = nextTick;
exports.asyncSleep = asyncSleep;
exports.asyncFunc = asyncFunc;
exports.SyncError = SyncError;