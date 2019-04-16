"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
var get_objectProperty_1 = require("../utils/get-objectProperty");
function getRegionMapImg(cheerioElem, country, countryId) {
    var objectProperties = globalStore_1.store.countries[countryId].objectProperties;
    cheerioElem('div.mapBox').each(function (index, element) {
        var map = get_objectProperty_1.getRelation(objectProperties, constants_1.consts.ONTOLOGY.HAS_REGION_MAP);
        var rmId = constants_1.consts.ONTOLOGY.INST_REGION_MAP + getUuid(country);
        var objectProp = {};
        if (!map) {
            if (globalStore_1.store.regionMaps[rmId]) {
                objectProp[constants_1.consts.ONTOLOGY.HAS_REGION_MAP] = globalStore_1.store.regionMaps[rmId];
            }
            else {
                objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_REGION_MAP, constants_1.consts.ONTOLOGY.ONT_REGION_MAP, rmId, "Region Map for " + country);
            }
        }
        var a = cheerioElem(element).find('img').attr('src');
        var regionMapImgUrl;
        if (a && a.replace('../', '')) {
            regionMapImgUrl = constants_1.consts.BASE.URL_BASE + a.replace('../', '');
            if (regionMapImgUrl && !regionMapImgUrl.includes('locator-map')) {
                var datatypeProp = {};
                datatypeProp[constants_1.consts.ONTOLOGY.DT_LOCATOR_URI] = regionMapImgUrl;
                objectProp[constants_1.consts.ONTOLOGY.HAS_REGION_MAP].datatypeProperties = datatypeProp;
                globalStore_1.store.regionMaps[rmId] = objectProp[constants_1.consts.ONTOLOGY.HAS_REGION_MAP];
                globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_REGION_MAP, objectProp));
            }
        }
        // TODO: scrape physical image from url and store it.
    });
}
exports.getRegionMapImg = getRegionMapImg;
;
