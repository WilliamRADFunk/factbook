const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');

var getClimate = function(cheerioElem, country) {
    var objectProperties = store.countries[country].objectProperties;
	var map = getRelation(objectProperties, consts.CUSTOM.HAS_CLIMATE);
	if (!map) {
		var objectProp = {};
		objectProp[consts.CUSTOM.HAS_CLIMATE] = {
			id: consts.CUSTOM.INST_CLIMATE + getUuid(country),
			label: 'hasClimate',
			type: consts.CUSTOM.ONT_CLIMATE,
			datatypeProperties: {},
			objectProperties: []
		};
		map = objectProp[consts.CUSTOM.HAS_CLIMATE];
		store.countries[country].objectProperties.push(objectProp);
	}

	var mapZone = getRelation(map.objectProperties, consts.CUSTOM.HAS_CLIMATE_ZONE);
	var zone;
	if (!mapZone) {
		var attr = {};
		attr[consts.CUSTOM.CLIMATE_ZONE_NAME] = 'N/A';
		attr[consts.CUSTOM.CLIMATE_ZONE_DESCRIPTION] = 'N/A';

		zone = {};
		zone[consts.CUSTOM.HAS_CLIMATE_ZONE] = {
			id: consts.CUSTOM.INST_CLIMATE_ZONE + getUuid(country),
			label: 'hasClimateZone',
			type: consts.CUSTOM.ONT_CLIMATE_ZONE,
			datatypeProperties: attr,
			objectProperties: []
		};
		mapZone = zone[consts.CUSTOM.HAS_CLIMATE_ZONE];
	}
	map.objectProperties.push(zone);

	cheerioElem('#field-climate').each(function() {
        var climGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim()
        if (climGrd) {
			var tempSplit = climGrd.replace(/\\n/g, '').trim().split(';');
			mapZone.datatypeProperties[consts.CUSTOM.CLIMATE_ZONE_NAME] = tempSplit[0].trim();
			mapZone.datatypeProperties[consts.CUSTOM.CLIMATE_ZONE_DESCRIPTION] = tempSplit.slice(1).join(';').trim();
        }
	});
};

module.exports = getClimate;