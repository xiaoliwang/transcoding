"use strict";

const R = require("ramda")
const nedb = require("../lib/NedbConnection");
const { getRandomInt } = require("../lib/random");

test("sync functions in nedb", async () => {
    let index = 0;
    let times = getRandomInt(5, 20);
    // Initialize Database    
    await nedb.removeSync({ type: "test" }, { multi: true });
    
    let doc = { type: "test", info: "value" };
    let docs = R.repeat(doc, times);
    let new_docs = await nedb.insertSync(docs);
    R.forEach((doc_id) => {
        nedb.updateSync({ _id: doc_id }, { $set: {info: `value${index++}`}})
    }, R.map((new_doc) => new_doc._id, new_docs));
    docs = await nedb.findSync({ type: "test" });
    let expected = R.map((index) => `value${index}`,R.range(0, times));
    expect(R.map((doc) => doc.info, docs)).toEqual(expect.arrayContaining(expected));
    let delete_num = await nedb.removeSync( {type: "test" }, { multi: true });
    expect(delete_num).toEqual(times);
});