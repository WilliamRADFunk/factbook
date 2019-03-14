import { store } from '../constants/globalStore';
import { loadFile } from './load-file';

export function loadFiles() {
    const LOG_FILE_NAME = 'logs/log-' + ((new Date()).toISOString()).replace(':', '-').replace(':', '-').replace('.', '-').trim() + '.log';
    store.LOG_STREAM = require('simple-node-logger').createSimpleFileLogger(LOG_FILE_NAME);
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
