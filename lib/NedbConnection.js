"use strict";

const Datastore = require("nedb");
const { promisify } = require("util");
const { DB_FILE } = require("../config/system");

let db = new Datastore({ filename: DB_FILE, autoload: true });

db.insertSync = promisify(db.insert);
db.removeSync = promisify(db.remove);
db.updateSync = promisify(db.update);
db.findSync = promisify(db.find);
db.findOneSync = promisify(db.findOne);
db.count = promisify(db.count);

module.exports = db;