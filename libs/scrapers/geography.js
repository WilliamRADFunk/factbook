const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');

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
        if (geoAttr) { return; }

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

			var objectProp = {};
			objectProp[consts.CUSTOM.HAS_LOCATION] = {
				id: consts.CUSTOM.INST_GEO_LOCATION + getUuid(country),
				label: 'hasGeographicLocation',
				type: consts.CUSTOM.ONT_GEO_LOCATION,
				datatypeProperties: datatypeProp,
				objectProperties: []
			};

            store.countries[countryId].objectProperties.push(objectProp);
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