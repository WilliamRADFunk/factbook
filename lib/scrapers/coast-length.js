"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
var get_objectProperty_1 = require("../utils/get-objectProperty");
function getCoastLength(cheerioElem, country, countryId) {
    var objectProperties = globalStore_1.store.countries[countryId].objectProperties;
    var map = get_objectProperty_1.getRelation(objectProperties, constants_1.consts.ONTOLOGY.HAS_COAST);
    var clId = constants_1.consts.ONTOLOGY.INST_COAST + getUuid(country);
    var objectProp = {};
    var bailOut = true;
    cheerioElem('#field-coastline').each(function () {
        if (!map) {
            if (globalStore_1.store.coasts[clId]) {
                objectProp[constants_1.consts.ONTOLOGY.HAS_COAST] = globalStore_1.store.coasts[clId];
            }
            else {
                objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_COAST, constants_1.consts.ONTOLOGY.ONT_COAST, clId, "Coast of " + country);
                globalStore_1.store.coasts[clId] = objectProp[constants_1.consts.ONTOLOGY.HAS_COAST];
            }
            map = objectProp[constants_1.consts.ONTOLOGY.HAS_COAST];
            globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_COAST, objectProp));
        }
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
    cheerioElem('#field-coastline').each(function (index, element) {
        var coastGrd = cheerioElem(element).find('div.category_data.subfield.numeric').text().trim();
        if (coastGrd) {
            var coastGrdSplit = coastGrd.split('km');
            map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LENGTH] = coastGrdSplit[0].trim();
            map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LENGTH_MODIFIER] = coastGrdSplit.slice(1).join('km').replace(/\\n/g, '').trim() || null;
        }
    });
    map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_UNIT] = 'km';
}
exports.getCoastLength = getCoastLength;
;
