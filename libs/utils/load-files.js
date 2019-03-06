const fs = require('graceful-fs');

const store = require('../constants/globalStore');
const loadFile = require('./load-file.js');

var loadFiles = function() {
    const LOG_FILE_NAME = ('logs/log-' + new Date().toISOString() + '.txt').replace(':', '-');
    store.LOG_STREAM = fs.createWriteStream(LOG_FILE_NAME, {'flag': 'w'});
    store.LOG_FILE_NAME = LOG_FILE_NAME;

    loadFile('countries', 'countries', true);
    loadFile('border-maps', 'borderMaps');
    loadFile('borders', 'borders');
    loadFile('climates', 'climates');
    loadFile('climates-zones', 'climatesZones');
    loadFile('coasts', 'coasts');
    loadFile('domain-areas', 'domainAreas');
    loadFile('images', 'images');
    loadFile('national-flags', 'nationalFlags');
    loadFile('region-maps', 'regionMaps');
    loadFile('border-countries', 'borderCountries');
    loadFile('maritime-claims', 'maritimeClaims');
    loadFile('natural-resources', 'naturalResources');
    loadFile('locations', 'locations');
    loadFile('terrains', 'terrains');
};

module.exports = loadFiles;
