"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
var get_objectProperty_1 = require("../utils/get-objectProperty");
function getElevation(cheerioElem, country, countryId) {
    var objectProperties = globalStore_1.store.countries[countryId].objectProperties;
    var map = get_objectProperty_1.getRelation(objectProperties, constants_1.consts.ONTOLOGY.HAS_ELEVATION);
    var eId = constants_1.consts.ONTOLOGY.INST_ELEVATION + getUuid(country);
    var objectProp = {};
    var bailOut = true;
    cheerioElem('#field-elevation').each(function () {
        if (!map) {
            if (globalStore_1.store.elevations[eId]) {
                objectProp[constants_1.consts.ONTOLOGY.HAS_ELEVATION] = globalStore_1.store.elevations[eId];
            }
            else {
                objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_ELEVATION, constants_1.consts.ONTOLOGY.ONT_ELEVATION, eId, "Elevation for " + country);
                globalStore_1.store.elevations[eId] = objectProp[constants_1.consts.ONTOLOGY.HAS_ELEVATION];
            }
            map = objectProp[constants_1.consts.ONTOLOGY.HAS_ELEVATION];
            globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_ELEVATION, objectProp));
        }
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
    cheerioElem('#field-elevation > div.category_data.subfield.numeric').each(function (index, element) {
        var elevation1Switch = cheerioElem(element).find('span.subfield-name').text().trim();
        var elevation1Data = cheerioElem(element).find('span.subfield-number').text().trim();
        switch (elevation1Switch) {
            case 'mean elevation:':
                map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_MEAN_ELEVATION] = elevation1Data.replace(/[^0-9\-]/g, '').trim() || null;
                break;
        }
    });
    cheerioElem('#field-elevation > div.category_data.subfield.text').each(function (index, element) {
        var elevation2Switch = cheerioElem(element).find('span.subfield-name').text().trim();
        var elevation2Data = cheerioElem(element).text().trim();
        switch (elevation2Switch) {
            case 'lowest point:':
                var removelowestPoint = 'lowest point:';
                var lowPointTxt = elevation2Data.substr(elevation2Data.indexOf(removelowestPoint) + removelowestPoint.length).trim();
                if (lowPointTxt === 'sea level') {
                    map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LOWEST_POINT] = '0';
                    map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LOWEST_POINT_DESCRIPTION] = 'sea level';
                    break;
                }
                map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LOWEST_POINT] = lowPointTxt.replace(/[^0-9\-]/g, '').trim() || null;
                if (map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LOWEST_POINT]) {
                    map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LOWEST_POINT_DESCRIPTION] = lowPointTxt.substring(0, lowPointTxt.search(/[0-9\-]/g)).trim();
                }
                break;
            case 'highest point:':
                var removehighestPoint = 'highest point:';
                var highPointTxt = elevation2Data.substr(elevation2Data.indexOf(removehighestPoint) + removehighestPoint.length).trim();
                if (highPointTxt === 'sea level') {
                    map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_HIGHEST_POINT] = '0';
                    map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_HIGHEST_POINT_DESCRIPTION] = 'sea level';
                    break;
                }
                map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_HIGHEST_POINT] = highPointTxt.replace(/[^0-9\-]/g, '').trim() || null;
                if (map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_HIGHEST_POINT]) {
                    map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_HIGHEST_POINT_DESCRIPTION] = highPointTxt.substring(0, highPointTxt.search(/[0-9\-]/g)).trim();
                }
                break;
        }
    });
    map.datatypeProperties[constants_1.consts.ONTOLOGY.DT_UNIT] = 'm';
}
exports.getElevation = getElevation;
;
