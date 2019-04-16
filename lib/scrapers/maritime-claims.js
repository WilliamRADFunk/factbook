"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
var get_objectProperty_1 = require("../utils/get-objectProperty");
function getMaritimeClaims(cheerioElem, country, countryId) {
    var objectProperties = globalStore_1.store.countries[countryId].objectProperties;
    var map = get_objectProperty_1.getRelation(objectProperties, constants_1.consts.ONTOLOGY.HAS_MARITIME_CLAIM);
    var mcId = constants_1.consts.ONTOLOGY.INST_MARITIME_CLAIM + getUuid(country);
    var objectProp = {};
    var bailOut = true;
    cheerioElem('#field-maritime-claims').each(function () {
        if (!map) {
            if (globalStore_1.store.maritimeClaims[mcId]) {
                objectProp[constants_1.consts.ONTOLOGY.HAS_MARITIME_CLAIM] = globalStore_1.store.maritimeClaims[mcId];
            }
            else {
                objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_MARITIME_CLAIM, constants_1.consts.ONTOLOGY.ONT_MARITIME_CLAIM, mcId, "Maritime Claim for " + country);
                globalStore_1.store.maritimeClaims[mcId] = objectProp[constants_1.consts.ONTOLOGY.HAS_MARITIME_CLAIM];
            }
            map = objectProp[constants_1.consts.ONTOLOGY.HAS_MARITIME_CLAIM];
            globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_MARITIME_CLAIM, objectProp));
        }
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
    cheerioElem('#field-maritime-claims > div.category_data.subfield.numeric').each(function (index, element) {
        var seaSwitch = cheerioElem(element).find('span.subfield-name').text().trim();
        var seaData = cheerioElem(element).find('span.subfield-number').text().trim();
        switch (seaSwitch) {
            case 'territorial sea:':
                map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_TERRITORIAL_SEA] = seaData.replace(/,|[a-z]/g, '').trim();
                break;
            case 'exclusive economic zone:':
                map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_EXCLUSIVE_ECONOMIC_ZONE] = seaData.replace(/,|[a-z]/g, '').trim();
                break;
            case 'contiguous zone:':
                map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_CONTIGUOUS_ZONE] = seaData.replace(/,|[a-z]/g, '').trim();
                break;
            case 'exclusive fishing zone:':
                map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_EXCLUSIVE_FISHING_ZONE] = seaData.replace(/,|[a-z]/g, '').trim();
                break;
            case 'continental shelf:':
                map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_CONTINENTAL_SHELF] = seaData.replace(/,|[a-z]/g, '').trim();
                map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_CONTINENTAL_SHELF_MODIFIER] = seaData.substring(seaData.indexOf('nm or') + 5).trim();
                break;
        }
    });
    map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_UNIT] = 'nm';
    cheerioElem('#field-maritime-claims > div.category_data.note').each(function (index, element) {
        map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_SUPPLEMENTAL_EXPLANATION] = cheerioElem(element).text().replace(/\\n/g, ' ').trim();
    });
}
exports.getMaritimeClaims = getMaritimeClaims;
;
