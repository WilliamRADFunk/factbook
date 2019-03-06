const fs = require('fs');

const store = require('../constants/globalStore');

var loadFile = function(fileName, storeName, isCountry) {
    var fileData;
    // If file exists, great. Otherwise make a blank one for later.
    try {
        fileData = fs.readFileSync(`dist/${fileName}.json`);
    } catch (err) {
        fs.closeSync(fs.openSync(`dist/${fileName}.json`, 'w'));
    }
    // If preexisting file data, use it.
    if (fileData) {
        var file = JSON.parse(fileData);
        store[storeName] = file[storeName];
        if (isCountry) {
            store.countriesInList = file.countriesInList;
        }
    }
};

module.exports = loadFile;
