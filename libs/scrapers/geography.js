const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');
const entityMaker = require('../utils/entity-maker.js');
const entityRefMaker = require('../utils/entity-ref-maker.js');

var getGeography = function(cheerioElem, country, countryId) {
	cheerioElem('#field-location').each(function() {
        var locGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (locGrd) {
            store.countries[countryId].datatypeProperties[consts.CUSTOM.LOCATION_DESCRIPTION] = locGrd;
        }
	});
    let objectProperties = store.countries[countryId].objectProperties;
	cheerioElem('#field-geographic-coordinates').each(function() {
		let geoAttr = getRelation(objectProperties, consts.CUSTOM.HAS_LOCATION);
		var geoId = consts.CUSTOM.INST_GEO_LOCATION + getUuid(country);
		var objectProp = {};
		if (!geoAttr) {
			if (store.locations[geoId]) {
				objectProp[consts.CUSTOM.HAS_LOCATION] = store.locations[geoId];
			} else {
				objectProp = entityMaker(
					consts.CUSTOM.HAS_LOCATION,
					consts.CUSTOM.ONT_GEO_LOCATION,
					geoId,
					`Geographic Location for ${country}`);
				store.locations[geoId] = objectProp[consts.CUSTOM.HAS_LOCATION];
			}
			geoAttr = objectProp[consts.CUSTOM.HAS_LOCATION];
			store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_LOCATION, objectProp));
		}

        var geoGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (geoGrd) {
			let coords = geoGrd.split(',');
			let latSplit = coords[0].trim().split(' ');
			let lat = (latSplit[0].includes('S') ? -1 : 1) * Number(latSplit[0].trim() + '.' + latSplit[1].trim());
			let lngSplit = coords[1].trim().split(' ');
			let lng = (lngSplit[0].includes('W') ? -1 : 1) * Number(lngSplit[0].trim() + '.' + lngSplit[1].trim());
			
			var datatypeProp = {};
			datatypeProp[consts.WGS84_POS.LAT] = lat;
			datatypeProp[consts.WGS84_POS.LONG] = lng;
			datatypeProp[consts.WGS84_POS.LAT_LONG] = `${lat}, ${lng}`;

			objectProp[consts.CUSTOM.HAS_LOCATION].datatypeProperties = datatypeProp;
        }
    });
	cheerioElem('#field-map-references').each(function() {
        var mapRef = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (mapRef) {
            store.countries[countryId].datatypeProperties[consts.CUSTOM.MAP_REFERENCES] = mapRef;
        }
	});
};

module.exports = getGeography;