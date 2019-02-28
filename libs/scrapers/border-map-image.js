const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');
const entityMaker = require('../utils/entity-maker.js');

var getBorderMapImg = function(cheerioElem, country, countryId) {
    let objectProperties = store.countries[countryId].objectProperties;
    cheerioElem('div.locatorBox').each(function() {
        let map = getRelation(objectProperties, consts.CUSTOM.HAS_BORDER_MAP);
        var bmId = consts.CUSTOM.INST_BORDER_MAP + getUuid(country);
        var objectProp = {};
        if (!map) {
            if (store.borderMaps[bmId]) {
                objectProp[consts.CUSTOM.HAS_BORDER_MAP] = store.borderMaps[bmId];
            } else {
                objectProp = entityMaker(
                    consts.CUSTOM.HAS_BORDER_MAP,
                    consts.CUSTOM.ONT_BORDER_MAP,
                    bmId,
                    `Border Map of ${country}`);
                store.borderMaps[bmId] = objectProp[consts.CUSTOM.HAS_BORDER_MAP];
            }
            map = objectProp[consts.CUSTOM.HAS_BORDER_MAP];
            store.countries[countryId].objectProperties.push(objectProp);
        }
        var a = cheerioElem(this).find('img').attr('src');
        var borderMapUrl;
        if (a && a.replace('../', '')) {
            borderMapUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
        }
        if (borderMapUrl) {
			var datatypeProp = {};
			datatypeProp[consts.CUSTOM.LOCATION_URI] = borderMapUrl;
			objectProp[consts.CUSTOM.HAS_BORDER_MAP].datatypeProperties = datatypeProp;
        }
        // TODO: scrape physical image from url and store it.
    });
};

module.exports = getBorderMapImg;