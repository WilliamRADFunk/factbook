const saveFile = require('./save-file.js');

var saveFiles = function() {
	saveFile('countries', 'countries');
	saveFile('border-countries', 'borderCountries');
	saveFile('border-maps', 'borderMaps');
	saveFile('climates', 'climates');
	saveFile('climates-zones', 'climateZones');
	saveFile('coasts', 'coasts');
	saveFile('domain-areas', 'domainAreas');
	saveFile('images', 'images');
	saveFile('locations', 'locations');
	saveFile('national-flags', 'nationalFlags');
	saveFile('region-maps', 'regionMaps');
	saveFile('borders', 'borders');
	saveFile('maritime-claims', 'maritimeClaims');
	saveFile('natural-resources', 'naturalResources');
	saveFile('terrains', 'terrains');
};

module.exports = saveFiles;