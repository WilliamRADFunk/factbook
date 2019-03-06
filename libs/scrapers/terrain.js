const parsedSingleLine = require('./scraper-forms/parsed-single-line.js');

var getTerrains = function(cheerioElem, country, countryId) {
	let origParams = {
		cheerioElem,
		country,
		countryId
	};
	parsedSingleLine(
		origParams,
		'#field-terrain',
		'HAS_TERRAIN',
		'INST_TERRAIN',
		'ONT_TERRAIN',
		'terrains',
		'terrainDescription',
		'Terrain',
		';');
};

module.exports = getTerrains;