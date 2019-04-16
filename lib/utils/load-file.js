"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("graceful-fs");
var globalStore_1 = require("../constants/globalStore");
function loadFile(fileName, storeName, isCountry) {
    var fileData;
    // If file exists, great. Otherwise make a blank one for later.
    try {
        fileData = fs.readFileSync("dist/json/" + fileName + ".json");
    }
    catch (err) {
        fileData = '';
    }
    // If preexisting file data, use it.
    if (fileData) {
        var file = JSON.parse(fileData);
        globalStore_1.store[storeName] = file[storeName];
        if (isCountry) {
            globalStore_1.store.countriesInList = file.countriesInList;
        }
    }
}
exports.loadFile = loadFile;
;
