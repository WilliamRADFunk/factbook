const fs = require('fs');

const store = require('../constants/globalStore');
const loadFile = require('./load-file.js');

var loadFiles = function() {
    const LOG_FILE_NAME = ('logs/log-' + new Date().toISOString() + '.txt').replace(':', '-');
    fs.closeSync(fs.openSync(LOG_FILE_NAME, 'w'));
    store['LOG_FILE_NAME'] = LOG_FILE_NAME;

    loadFile('countries', 'countries', true);
    loadFile('border-maps', 'border-maps');
    loadFile('climates', 'climates');
    loadFile('climates-zones', 'climates-zones');
    loadFile('coasts', 'coasts');
    loadFile('domain-areas', 'domain-areas');
    loadFile('images', 'images');
    loadFile('national-flags', 'national-flags');
    loadFile('region-maps', 'region-maps');
    loadFile('border-countries', 'border-countries');
    loadFile('maritime-claims', 'maritime-claims');
    loadFile('natural-resources', 'natural-resources');
    loadFile('terrains', 'terrains');
};

module.exports = loadFiles;
