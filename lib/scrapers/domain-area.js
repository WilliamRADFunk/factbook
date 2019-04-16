"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
var get_objectProperty_1 = require("../utils/get-objectProperty");
function getArea(cheerioElem, country, countryId) {
    var objectProperties = globalStore_1.store.countries[countryId].objectProperties;
    var map = get_objectProperty_1.getRelation(objectProperties, constants_1.consts.ONTOLOGY.HAS_DOMAIN_AREA);
    var daId = constants_1.consts.ONTOLOGY.INST_DOMAIN_AREA + getUuid(country);
    var objectProp = {};
    var bailOut = true;
    cheerioElem('#field-area').each(function () {
        if (!map) {
            if (globalStore_1.store.domainAreas[daId]) {
                objectProp[constants_1.consts.ONTOLOGY.HAS_DOMAIN_AREA] = globalStore_1.store.domainAreas[daId];
            }
            else {
                objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_DOMAIN_AREA, constants_1.consts.ONTOLOGY.ONT_DOMAIN_AREA, daId, "Area of Domain for " + country);
                globalStore_1.store.domainAreas[daId] = objectProp[constants_1.consts.ONTOLOGY.HAS_DOMAIN_AREA];
            }
            map = objectProp[constants_1.consts.ONTOLOGY.HAS_DOMAIN_AREA];
            globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_DOMAIN_AREA, objectProp));
        }
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
    cheerioElem('#field-area > div.category_data.subfield.numeric').each(function (index, element) {
        var areaSwitch = cheerioElem(element).find('span.subfield-name').text().trim();
        var areaData = cheerioElem(element).find('span.subfield-number').text().trim();
        switch (areaSwitch) {
            case 'total:':
                map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_TOTAL_AREA] = areaData.replace(/,|[a-z]/g, '').trim();
                break;
            case 'land:':
                map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LAND_AREA] = areaData.replace(/,|[a-z]/g, '').trim();
                break;
            case 'water:':
                map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_WATER_AREA] = areaData.replace(/,|[a-z]/g, '').trim();
                break;
        }
    });
    cheerioElem('#field-area > div > span.category_data').each(function (index, element) {
        var areaRank = cheerioElem(element).find('a').text().trim();
        if (areaRank) {
            map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_AREA_RANK] = areaRank;
        }
    });
    map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_UNIT] = 'sq km';
    cheerioElem('#field-area-comparative').each(function (index, element) {
        var areaGrd = cheerioElem(element).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (areaGrd) {
            map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_AREA_COMPARATIVE] = areaGrd;
        }
    });
}
exports.getArea = getArea;
;
