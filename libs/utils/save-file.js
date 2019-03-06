const fs = require('graceful-fs');

const store = require('../constants/globalStore');

var saveFile = function(fileName, storeName) {
    let file = JSON.stringify(store[storeName]);
	file = file.replace(/\\n/g, ' ');
	fs.writeFileSync(`dist/${fileName}.json`, file);
};

module.exports = saveFile;
