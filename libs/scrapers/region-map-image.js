const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');
const entityMaker = require('../utils/entity-maker.js');
const entityRefMaker = require('../utils/entity-ref-maker.js');

var getRegionMapImg = function(cheerioElem, country, countryId) {
    let objectProperties = store.countries[countryId].objectProperties;
    cheerioElem('div.mapBox').each(function() {
        let map = getRelation(objectProperties, consts.CUSTOM.HAS_REGION_MAP);
        let rmId = consts.CUSTOM.INST_REGION_MAP + getUuid(country);
        var objectProp = {};
        if (!map) {
            if (store.regionMaps[rmId]) {
                objectProp[consts.CUSTOM.HAS_REGION_MAP] = store.regionMaps[rmId];
            } else {
                objectProp = entityMaker(
                    consts.CUSTOM.HAS_REGION_MAP,
                    consts.CUSTOM.ONT_REGION_MAP,
                    rmId,
                    'Region Map');
            }
        }
        var a = cheerioElem(this).find('img').attr('src');
        var regionMapImgUrl;
        if (a && a.replace('../', '')) {
            regionMapImgUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
            if (regionMapImgUrl.includes('locator-map')) { }
            if (regionMapImgUrl && !regionMapImgUrl.includes('locator-map')) {
                var datatypeProp = {};
                datatypeProp[consts.CUSTOM.LOCATION_URI] = regionMapImgUrl;
                objectProp[consts.CUSTOM.HAS_REGION_MAP].datatypeProperties = datatypeProp;
                store.regionMaps[rmId] = objectProp[consts.CUSTOM.HAS_REGION_MAP];
                store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_REGION_MAP, objectProp));
            }
        }
        // TODO: scrape physical image from url and store it.
    });
};

module.exports = getRegionMapImg;