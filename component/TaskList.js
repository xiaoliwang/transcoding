const R = require("ramda");
const path = require("path");

class TaskList {
    constructor() {
        this.tasks = {};
    }

    newTask(sound_id, bit_rate, relative_remote_path) {
        let task = new Task(this, sound_id, bit_rate, relative_remote_path);
        this.tasks[sound_id] = task;
        return task;
    }

    deleteTask(id) {
        delete(this.tasks[id]);
    }
}

class Task {
    constructor(task_list, sound_id, bit_rate, relative_remote_path) {
        let sub_tasks = [];
        switch(true) {
            case (bit_rate >= 128):
                sub_tasks.push(new SubTask(this, '128', 128, relative_remote_path));
            case (bit_rate >= 32):
                sub_tasks.push(new SubTask(this, '32', 32, relative_remote_path));
            default:
                sub_tasks.push(new SubTask(this, '64', bit_rate, relative_remote_path));
        }
        this.task_list = task_list;
        this.sub_tasks = sub_tasks;
        this.id = sound_id;
    }

    getProgress() {
        let progress = R.mean(R.map(sub_task => sub_task.status, this.sub_tasks));
        return progress;
    }

    done() {
        if (1 === this.getProgress()) {
            this.task_list.deleteTask(this.id);
        }
    }
}

class SubTask {
    constructor(task, filedName, rate, relative_remote_path) {
        this.task = task;
        this.filed = `soundurl_${filedName}`;
        this.rate = rate;
        this.dir = '64' === filedName ? 'MP3' : `${filedName}BIT`;
        this.status = SubTask.UNDONE;
        this.remote_path = `${this.dir}/${relative_remote_path}`;
    }

    updateStatus(progress) {
        if (progress >= 1 || progress <= 0) throw new Error("参数不合法");
        this.status = progress;
    }

    done() {
        this.status = SubTask.DONE;
        this.task.done();
    }
}

SubTask.UNDONE = 0;
SubTask.DONE = 1;

const task_list = new TaskList();
module.exports = task_list;