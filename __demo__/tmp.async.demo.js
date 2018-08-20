const async = require("async");
const R = require("ramda");

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

const longFunc = async(index) => {
    let sleep = 1000 + Math.random() * 2000;
    console.log(`mission ${index} start`);
    await snooze(sleep);
    // console.log(`mission ${index} stop`);
    return index;
}

/*
console.time("test");
let longFuncs = []
for (let i = 0; i < 10; i++) {
    longFuncs.push(longFunc());
}
Promise.all(longFuncs).then(() => {
    console.timeEnd("test");
})
*/

console.time("task");
var q = async.queue(longFunc, 5);
q.drain = function() {
    console.timeEnd("task");
}

let tasks = R.range(0, 10);

q.push(tasks, (err, index) => {
    console.log(`mission ${index} finish`);
});

tasks = R.range(10, 100);

q.push(tasks, (err, index) => {
    console.log(`mission ${index} finish`);
});