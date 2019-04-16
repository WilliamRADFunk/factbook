"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
var get_objectProperty_1 = require("../utils/get-objectProperty");
function getBorderMapImg(cheerioElem, country, countryId) {
    var objectProperties = globalStore_1.store.countries[countryId].objectProperties;
    cheerioElem('div.locatorBox').each(function (index, element) {
        var map = get_objectProperty_1.getRelation(objectProperties, constants_1.consts.ONTOLOGY.HAS_BORDER_MAP);
        var a = cheerioElem(element).find('img').attr('src');
        var borderMapUrl;
        var bmId;
        if (a && a.replace('../', '')) {
            var borderMapId = a.replace('../', '');
            borderMapUrl = constants_1.consts.BASE.URL_BASE + a.replace('../', '');
            bmId = constants_1.consts.ONTOLOGY.INST_BORDER_MAP + getUuid(borderMapId);
        }
        var objectProp = {};
        if (!map) {
            if (globalStore_1.store.borderMaps[bmId]) {
                objectProp[constants_1.consts.ONTOLOGY.HAS_BORDER_MAP] = globalStore_1.store.borderMaps[bmId];
            }
            else {
                objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_BORDER_MAP, constants_1.consts.ONTOLOGY.ONT_BORDER_MAP, bmId, "Border Map for " + country);
                globalStore_1.store.borderMaps[bmId] = objectProp[constants_1.consts.ONTOLOGY.HAS_BORDER_MAP];
            }
            map = objectProp[constants_1.consts.ONTOLOGY.HAS_BORDER_MAP];
            globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_BORDER_MAP, objectProp));
        }
        if (borderMapUrl) {
            var datatypeProp = {};
            datatypeProp[constants_1.consts.ONTOLOGY.DT_LOCATOR_URI] = borderMapUrl;
            objectProp[constants_1.consts.ONTOLOGY.HAS_BORDER_MAP].datatypeProperties = datatypeProp;
        }
        // TODO: scrape physical image from url and store it.
    });
}
exports.getBorderMapImg = getBorderMapImg;
;
