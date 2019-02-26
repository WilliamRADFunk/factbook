const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');

var getBorderMapImg = function(cheerioElem, country, countryId) {
    let objectProperties = store.countries[countryId].objectProperties;
    cheerioElem('div.locatorBox').each(function() {
        let map = getRelation(objectProperties, consts.CUSTOM.HAS_BORDER_MAP);
        if (map && map.datatypeProperties && map.datatypeProperties[consts.CUSTOM.LOCATION_URI]) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var borderMapUrl;
        if (a && a.replace('../', '')) {
            borderMapUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
        }
        if (borderMapUrl) {
			var datatypeProp = {};
			datatypeProp[consts.CUSTOM.LOCATION_URI] = borderMapUrl;

			var objectProp = {};
			objectProp[consts.CUSTOM.HAS_BORDER_MAP] = {
				id: consts.CUSTOM.INST_BORDER_MAP + getUuid(country),
				label: 'hasBorderMap',
				type: consts.CUSTOM.ONT_BORDER_MAP,
				datatypeProperties: datatypeProp,
				objectProperties: []
			};

            store.countries[countryId].objectProperties.push(objectProp);
        }
        // TODO: scrape physical image from url and store it.
    });
};

module.exports = getBorderMapImg;