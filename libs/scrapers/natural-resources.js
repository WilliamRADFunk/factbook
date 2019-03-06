const parsedSingleLine = require('./scraper-forms/parsed-single-line.js');

var getNaturalResources = function(cheerioElem, country, countryId) {
	let origParams = {
		cheerioElem,
		country,
		countryId
	};
	parsedSingleLine(
		origParams,
		'#field-natural-resources',
		'HAS_NATURAL_RESOURCE',
		'INST_NATURAL_RESOURCE',
		'ONT_NATURAL_RESOURCE',
		'naturalResources',
		'resourceName',
		'Natural Resource',
		',');
};

module.exports = getNaturalResources;