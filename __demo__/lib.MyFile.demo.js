const { getFileName } = require("../lib/MyFile");

let file_path = "/path/to/file.ext";

let file_name = getFileName(file_path);
let file_name_without_ext = getFileName(file_path, false);

console.log(file_name); // file.ext
console.log(file_name_without_ext); // file