"use strict";

const Datastore = require("nedb");
const { promisify } = require("util");
const { DB_FILE } = require("../config/system");

let db = new Datastore({ filename: DB_FILE, autoload: true });

db.insertASync = promisify(db.insert);
db.removeASync = promisify(db.remove);
db.updateASync = promisify(db.update);
db.findASync = promisify(db.find);
db.findOneASync = promisify(db.findOne);
db.count = promisify(db.count);
db.doc_types = {
  GET_COMPRESS: 'get_compress'
};

module.exports = db;