"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
var get_objectProperty_1 = require("../utils/get-objectProperty");
function getFlag(cheerioElem, country, countryId) {
    var objectProperties = globalStore_1.store.countries[countryId].objectProperties;
    var flag = get_objectProperty_1.getRelation(objectProperties, constants_1.consts.ONTOLOGY.HAS_FLAG);
    var fId = constants_1.consts.ONTOLOGY.INST_FLAG + getUuid(country);
    var objectProp = {};
    var bailOut = true;
    cheerioElem('div.flagBox').each(function () {
        if (!flag) {
            if (globalStore_1.store.nationalFlags[fId]) {
                objectProp[constants_1.consts.ONTOLOGY.HAS_FLAG] = globalStore_1.store.nationalFlags[fId];
            }
            else {
                objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_FLAG, constants_1.consts.ONTOLOGY.ONT_FLAG, fId, "National Flag of " + country);
                globalStore_1.store.nationalFlags[fId] = objectProp[constants_1.consts.ONTOLOGY.HAS_FLAG];
            }
            flag = objectProp[constants_1.consts.ONTOLOGY.HAS_FLAG];
            globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_FLAG, objectProp));
        }
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
    cheerioElem('div.flagBox').each(function (index, element) {
        var a = cheerioElem(element).find('img').attr('src');
        var flagImgUrl;
        if (a && a.replace('../', '')) {
            flagImgUrl = constants_1.consts.BASE.URL_BASE + a.replace('../', '');
        }
        if (flagImgUrl) {
            flag.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LOCATOR_URI] = flagImgUrl;
        }
        // TODO: scrape physical image from url and store it.
    });
    cheerioElem('div.modalFlagDesc').each(function (index, element) {
        var b = cheerioElem(element).find('div.photogallery_captiontext').text().trim();
        if (!b) {
            return;
        }
        if (flag) {
            flag.datatypeProperties[constants_1.consts.ONTOLOGY.DT_CONTENT_DESCRIPTION] = b.replace(/\\n/g, '').trim();
        }
        else {
            flag.datatypeProperties[constants_1.consts.ONTOLOGY.DT_CONTENT_DESCRIPTION] = b.trim();
        }
    });
}
exports.getFlag = getFlag;
;
