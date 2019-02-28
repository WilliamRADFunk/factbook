const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');
const entityMaker = require('../utils/entity-maker.js');

var getClimate = function(cheerioElem, country, countryId) {
    var objectProperties = store.countries[countryId].objectProperties;
	var map = getRelation(objectProperties, consts.CUSTOM.HAS_CLIMATE);
	if (!map) {
		var cId = consts.CUSTOM.INST_CLIMATE + getUuid(country);
		var objectProp = {};
		if (store.climates[cId]) {
			objectProp[consts.CUSTOM.HAS_CLIMATE] = store.climates[cId];
		} else {
			objectProp = entityMaker(
				consts.CUSTOM.HAS_CLIMATE,
				consts.CUSTOM.ONT_CLIMATE,
				cId,
				`Climate for ${country}`);
			store.climates[cId] = objectProp[consts.CUSTOM.HAS_CLIMATE];
		}
		map = objectProp[consts.CUSTOM.HAS_CLIMATE];
		store.countries[countryId].objectProperties.push(objectProp);
	}

	var mapZone = getRelation(map.objectProperties, consts.CUSTOM.HAS_CLIMATE_ZONE);
	var zone;
	if (!mapZone) {
		var czId = consts.CUSTOM.INST_CLIMATE_ZONE + getUuid(country);
		var zone = {};
		if (store.climateZones[czId]) {
			zone[consts.CUSTOM.HAS_CLIMATE_ZONE] = store.climateZones[czId];
		} else {
			var attr = {};
			attr[consts.CUSTOM.CLIMATE_ZONE_NAME] = 'N/A';
			attr[consts.CUSTOM.CLIMATE_ZONE_DESCRIPTION] = 'N/A';

			zone = {};
			zone = entityMaker(
				consts.CUSTOM.HAS_CLIMATE_ZONE,
				consts.CUSTOM.ONT_CLIMATE_ZONE,
				czId,
				`Climate Zone for ${country}`);
			store.climateZones[czId] = zone[consts.CUSTOM.HAS_CLIMATE_ZONE];
		}
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