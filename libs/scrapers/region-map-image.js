const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');

var getRegionMapImg = function(cheerioElem, country) {
    let objectProperties = store.countries[country].objectProperties;
    cheerioElem('div.mapBox').each(function() {
        let map = getRelation(objectProperties, consts.CUSTOM.HAS_REGION_MAP);
        if (map && map.datatypeProperties && map.datatypeProperties[consts.CUSTOM.LOCATION_URI]) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var regionMapImgUrl;
        if (a && a.replace('../', '')) {
            regionMapImgUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
        }
        if (regionMapImgUrl) {
			var datatypeProp = {};
			datatypeProp[consts.CUSTOM.LOCATION_URI] = regionMapImgUrl;

			var objectProp = {};
			objectProp[consts.CUSTOM.HAS_REGION_MAP] = {
				id: consts.CUSTOM.INST_REGION_MAP + getUuid(country),
				label: 'hasRegionMap',
				type: consts.CUSTOM.ONT_REGION_MAP,
				datatypeProperties: datatypeProp,
				objectProperties: []
			};

            store.countries[country].objectProperties.push(objectProp);
        }
        // TODO: scrape physical image from url and store it.
    });
};

module.exports = getRegionMapImg;