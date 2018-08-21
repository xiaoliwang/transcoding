"use strict";
const R = require("ramda");
const sync = require("../lib/sync");
const random = require("../lib/random");

async function async_start(time_spent) {
    let value = await sync.asyncFunc(time_spent, "lock_value");
    return value;
}

async function sync_start(locker, time_spent) {
    await locker.lock();
    let value = await sync.asyncFunc(time_spent, "lock_value");
    locker.unlock();
    return value;
}

let global_index = 0;
let once_1 = new sync.Once;
async function cocurrent_func(x) {
    await once_1.do(() => {
        ++global_index;
    });
}

let once_2 = new sync.Once;
async function wrong_func() {
    await once_2.do(() => {
        throw new Error("Test Error");
    });
}

describe("Test all function in sync module", () => {
    test("test sync function", () => {
        let times = random.getRandomInt(1, 3);
        let locker = new sync.Locker();
        let missions = [];
        let time_spent = 0;
        while (times--) {
            let sec = random.getRandomInt(1, 2);
            time_spent += sec;
            missions.push(sync_start(locker, sec * 1000));
        }
    
        jest.setTimeout((time_spent + 2) * 1000);

        let before = process.hrtime();
        return Promise.all(missions).then((values) => {
            let real_cost = process.hrtime(before);
            expect(real_cost[0]).toBe(time_spent);
        });
    });
    
    test("test async function", () => {
        let times = random.getRandomInt(2, 4);
        let missions = [];
        let time_spent = 0;
        while (times--) {
            let sec = random.getRandomInt(1, 2);
            time_spent = Math.max(time_spent, sec);
            missions.push(async_start(sec * 1000));
        }
    
        let before = process.hrtime();
        return Promise.all(missions).then((values) => {
            let real_cost = process.hrtime(before);
            expect(real_cost[0]).toBe(time_spent);
        });
    });

    test("execute only once", () => {
        let times = random.getRandomInt(2, 5);
        return Promise.all(R.times(cocurrent_func, times)).then(() => {
            expect(global_index).toBe(1);
        });
    });

    test("throw unlock of unlocked locker error", () => {
        let locker = new sync.Locker();
        expect(locker.unlock).toThrow(sync.SyncError);
    });

    test("throw an error inside once", () => {
        expect(wrong_func()).rejects.toThrow();
    });

});

describe("Test all function in random module", () => {
    test("get random integers", () => {
        let min = 3, max = 7;
        let nums = R.range(min, max + 1);
        let rand_test = () => random.getRandomInt(min, max);
        let expected = R.times(rand_test, 10);
        expect(nums).toEqual(expect.arrayContaining(expected));
    });

    test("wrong params for random integers", () => {
        let min = 7, max = 3;
        expect(() => random.getRandomInt(min, max)).toThrow();
    });

    test("get random bools", () => {
        let expected = R.times(random.getRandomBool, 10);
        expect([true, false]).toEqual(expect.arrayContaining(expected));
    });

    test("get random floating numbers", () => {
        let min = 3, max = 7;
        let rand_test = () => random.getRandomFloat(min, max);
        let expected = R.times(rand_test, 20);
        for (let num of expected) {
            expect(num).toBeLessThanOrEqual(max);
            expect(num).toBeGreaterThanOrEqual(min);
        }
    });

    test("wrong params for random integers", () => {
        let min = 7, max = 3;
        expect(() => random.getRandomFloat(min, max)).toThrow();
    });
})