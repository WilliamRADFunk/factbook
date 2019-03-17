import { store } from '../constants/globalStore';
import { loadFile } from './load-file';

export function loadFiles() {
    const LOG_FILE_NAME = 'logs/log-' + ((new Date()).toISOString()).replace(':', '-').replace(':', '-').replace('.', '-').trim() + '.log';
    store.LOG_STREAM = require('simple-node-logger').createSimpleFileLogger(LOG_FILE_NAME);
    store.LOG_FILE_NAME = LOG_FILE_NAME;

    loadFile('agricultural-lands', 'agriculturalLands');
    loadFile('arable-lands', 'arableLands');
	loadFile('artificially-irrigated-lands', 'artificiallyIrrigatedLands');
    loadFile('border-countries', 'borderCountries');
    loadFile('border-maps', 'borderMaps');
    loadFile('borders', 'borders');
    loadFile('climates', 'climates');
    loadFile('climates-zones', 'climatesZones');
    loadFile('coasts', 'coasts');
    loadFile('countries', 'countries', true);
    loadFile('domain-areas', 'domainAreas');
    loadFile('forest-lands', 'forestLands');
    loadFile('images', 'images');
    loadFile('land-uses', 'landUses');
    loadFile('locations', 'locations');
    loadFile('maritime-claims', 'maritimeClaims');
    loadFile('national-flags', 'nationalFlags');
	loadFile('natural-hazards', 'naturalHazards');
    loadFile('natural-resources', 'naturalResources');
    loadFile('other-lands', 'otherLands');
    loadFile('permanent-crops-lands', 'permanentCropsLands');
    loadFile('permanent-pasture-lands', 'permanentPastureLands');
    loadFile('region-maps', 'regionMaps');
    loadFile('terrains', 'terrains');
};
