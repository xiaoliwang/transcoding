"use strict";
const { getFileName } = require("../lib/MyFile");

test("get file name", () => {
    const file_path = "/path/to/file.ext";
    expect(getFileName(file_path)).toBe("file.ext");
    expect(getFileName(file_path, false)).toBe("file");
});
