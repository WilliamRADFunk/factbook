"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
var get_objectProperty_1 = require("../utils/get-objectProperty");
function getClimate(cheerioElem, country, countryId) {
    var objectProperties = globalStore_1.store.countries[countryId].objectProperties;
    var map = get_objectProperty_1.getRelation(objectProperties, constants_1.consts.ONTOLOGY.HAS_CLIMATE);
    var mapZone;
    var bailOut = true;
    cheerioElem('#field-climate').each(function () {
        if (!map) {
            var cId = constants_1.consts.ONTOLOGY.INST_CLIMATE + getUuid(country);
            var objectProp = {};
            if (globalStore_1.store.climates[cId]) {
                objectProp[constants_1.consts.ONTOLOGY.HAS_CLIMATE] = globalStore_1.store.climates[cId];
            }
            else {
                objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_CLIMATE, constants_1.consts.ONTOLOGY.ONT_CLIMATE, cId, "Climate for " + country);
                globalStore_1.store.climates[cId] = objectProp[constants_1.consts.ONTOLOGY.HAS_CLIMATE];
            }
            map = objectProp[constants_1.consts.ONTOLOGY.HAS_CLIMATE];
            globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_CLIMATE, objectProp));
        }
        mapZone = get_objectProperty_1.getRelation(map.objectProperties, constants_1.consts.ONTOLOGY.HAS_CLIMATE_ZONE);
        var zone;
        if (!mapZone) {
            var czId = constants_1.consts.ONTOLOGY.INST_CLIMATE_ZONE + getUuid(country);
            zone = {};
            if (globalStore_1.store.climateZones[czId]) {
                zone[constants_1.consts.ONTOLOGY.HAS_CLIMATE_ZONE] = globalStore_1.store.climateZones[czId];
            }
            else {
                var attr = {};
                attr[constants_1.consts.ONTOLOGY.DT_CLIMATE_ZONE_NAME] = 'N/A';
                attr[constants_1.consts.ONTOLOGY.DT_CLIMATE_ZONE_DESCRIPTION] = 'N/A';
                zone = {};
                zone = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_CLIMATE_ZONE, constants_1.consts.ONTOLOGY.ONT_CLIMATE_ZONE, czId, "Climate Zone for " + country);
                globalStore_1.store.climateZones[czId] = zone[constants_1.consts.ONTOLOGY.HAS_CLIMATE_ZONE];
            }
            mapZone = zone[constants_1.consts.ONTOLOGY.HAS_CLIMATE_ZONE];
        }
        map.objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_CLIMATE_ZONE, zone));
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
    cheerioElem('#field-climate').each(function (index, element) {
        var climGrd = cheerioElem(element).find('div.category_data.subfield.text').text().trim();
        if (climGrd) {
            var tempSplit = climGrd.replace(/\\n/g, '').trim().split(';');
            mapZone.datatypeProperties[constants_1.consts.ONTOLOGY.DT_CLIMATE_ZONE_NAME] = tempSplit[0].trim();
            mapZone.datatypeProperties[constants_1.consts.ONTOLOGY.DT_CLIMATE_ZONE_DESCRIPTION] = tempSplit.slice(1).join(';').trim();
            mapZone[constants_1.consts.RDFS.label] = "Climate Zone (" + mapZone.datatypeProperties[constants_1.consts.ONTOLOGY.DT_CLIMATE_ZONE_NAME] + ")";
        }
    });
}
exports.getClimate = getClimate;
;
