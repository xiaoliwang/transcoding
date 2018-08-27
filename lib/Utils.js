function timing_task(func, seconds) {
    let delay = seconds * 1000;
    func();
    setInterval(func, delay);
}

exports.timing_task = timing_task;