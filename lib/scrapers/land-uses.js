"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
var get_objectProperty_1 = require("../utils/get-objectProperty");
function getLandUses(cheerioElem, country, countryId) {
    var objectProperties = globalStore_1.store.countries[countryId].objectProperties;
    var map = get_objectProperty_1.getRelation(objectProperties, constants_1.consts.ONTOLOGY.HAS_LAND_USE);
    var luId = constants_1.consts.ONTOLOGY.INST_LAND_USE + getUuid(country);
    var objectProp = {};
    var bailOut = true;
    cheerioElem('#field-land-use').each(function () {
        if (!map) {
            if (globalStore_1.store.landUses[luId]) {
                objectProp[constants_1.consts.ONTOLOGY.HAS_LAND_USE] = globalStore_1.store.landUses[luId];
            }
            else {
                objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_LAND_USE, constants_1.consts.ONTOLOGY.ONT_LAND_USE, luId, "Land Use for " + country);
                globalStore_1.store.landUses[luId] = objectProp[constants_1.consts.ONTOLOGY.HAS_LAND_USE];
            }
            map = objectProp[constants_1.consts.ONTOLOGY.HAS_LAND_USE];
            globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_LAND_USE, objectProp));
        }
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
    cheerioElem('#field-land-use div.category_data.subfield.numeric').each(function (index, element) {
        var landUse1Switch = cheerioElem(element).find('span.subfield-name').text().trim();
        var landUse1Data = cheerioElem(element).find('span.subfield-number').text().trim();
        var date1Data = cheerioElem(element).find('span.subfield-date').text().trim();
        var refinedValue1 = landUse1Data.replace(/[^0-9\-\.]/g, '').trim() || null;
        if (refinedValue1) {
            var objectP = {};
            switch (landUse1Switch) {
                case 'agricultural land:':
                    var alId = constants_1.consts.ONTOLOGY.INST_AGRICULTURAL_LAND + getUuid(country);
                    objectP = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_AGRICULTURAL_LAND, constants_1.consts.ONTOLOGY.ONT_AGRICULTURAL_LAND, alId, "Agricultural Land Use for " + country);
                    var agLandRef = objectP[constants_1.consts.ONTOLOGY.HAS_AGRICULTURAL_LAND];
                    globalStore_1.store.agriculturalLands[alId] = agLandRef;
                    globalStore_1.store.landUses[luId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_AGRICULTURAL_LAND, objectP));
                    agLandRef.datatypeProperties[constants_1.consts.ONTOLOGY.DT_PERCENTAGE] = landUse1Data.replace(/[^0-9\-\.]/g, '').trim() || null;
                    agLandRef.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LAST_ESTIMATED] = date1Data.substring(date1Data.indexOf('('), date1Data.indexOf(')') + 1).trim() || 'N/A';
                    break;
                case 'forest:':
                    var fId = constants_1.consts.ONTOLOGY.INST_FOREST_LAND + getUuid(country);
                    objectP = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_FOREST_LAND, constants_1.consts.ONTOLOGY.ONT_FOREST_LAND, fId, "Forest Land Use for " + country);
                    var fLandRef = objectP[constants_1.consts.ONTOLOGY.HAS_FOREST_LAND];
                    globalStore_1.store.forestLands[fId] = fLandRef;
                    globalStore_1.store.landUses[luId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_FOREST_LAND, objectP));
                    fLandRef.datatypeProperties[constants_1.consts.ONTOLOGY.DT_PERCENTAGE] = landUse1Data.replace(/[^0-9\-\.]/g, '').trim() || null;
                    fLandRef.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LAST_ESTIMATED] = date1Data.substring(date1Data.indexOf('('), date1Data.indexOf(')') + 1).trim() || 'N/A';
                    break;
                case 'other:':
                    var oId = constants_1.consts.ONTOLOGY.INST_OTHER_LAND + getUuid(country);
                    objectP = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_OTHER_LAND, constants_1.consts.ONTOLOGY.ONT_OTHER_LAND, oId, "Other Land Use for " + country);
                    var oLandRef = objectP[constants_1.consts.ONTOLOGY.HAS_OTHER_LAND];
                    globalStore_1.store.otherLands[oId] = oLandRef;
                    globalStore_1.store.landUses[luId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_OTHER_LAND, objectP));
                    oLandRef.datatypeProperties[constants_1.consts.ONTOLOGY.DT_PERCENTAGE] = landUse1Data.replace(/[^0-9\-\.]/g, '').trim() || null;
                    oLandRef.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LAST_ESTIMATED] = date1Data.substring(date1Data.indexOf('('), date1Data.indexOf(')') + 1).trim() || 'N/A';
                    break;
            }
        }
    });
    cheerioElem('#field-land-use div.category_data.subfield.grouped_subfield').each(function (index, element) {
        var landUse2Data = cheerioElem(element).text().trim();
        var groupSplit = landUse2Data.split('/').map(function (land) { return land.trim(); });
        var percentages = groupSplit.map(function (land) { return land.substring(0, land.indexOf('%')).replace(/[^0-9\-\.]/g, '').trim(); });
        var dates = groupSplit.map(function (land) { return land.substring(land.indexOf('('), land.indexOf(')') + 1).trim(); });
        if (percentages.length) {
            // Arable Land
            var arbId = constants_1.consts.ONTOLOGY.INST_ARABLE_LAND + getUuid(country);
            var objectPropArable = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_ARABLE_LAND, constants_1.consts.ONTOLOGY.ONT_ARABLE_LAND, arbId, "Arable Land Use for " + country);
            var arbLandRef = objectPropArable[constants_1.consts.ONTOLOGY.HAS_ARABLE_LAND];
            globalStore_1.store.arableLands[arbId] = arbLandRef;
            globalStore_1.store.landUses[luId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_ARABLE_LAND, objectPropArable));
            arbLandRef.datatypeProperties[constants_1.consts.ONTOLOGY.DT_PERCENTAGE] = percentages[0] || null;
            arbLandRef.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LAST_ESTIMATED] = dates[0] || 'N/A';
            // Permanent Crops Land
            var pcId = constants_1.consts.ONTOLOGY.INST_PERMANENT_CROPS_LAND + getUuid(country);
            var objectPropPermCrop = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_PERMANENT_CROPS_LAND, constants_1.consts.ONTOLOGY.ONT_PERMANENT_CROPS_LAND, pcId, "Permanent Crops Land Use for " + country);
            var pcLandRef = objectPropPermCrop[constants_1.consts.ONTOLOGY.HAS_PERMANENT_CROPS_LAND];
            globalStore_1.store.permanentCropsLands[pcId] = pcLandRef;
            globalStore_1.store.landUses[luId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_PERMANENT_CROPS_LAND, objectPropPermCrop));
            pcLandRef.datatypeProperties[constants_1.consts.ONTOLOGY.DT_PERCENTAGE] = percentages[1] || null;
            pcLandRef.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LAST_ESTIMATED] = dates[1] || 'N/A';
            // Permanent Pasture Land
            var ppId = constants_1.consts.ONTOLOGY.INST_PERMANENT_PASTURE_LAND + getUuid(country);
            var objectPropPermPast = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_PERMANENT_PASTURE_LAND, constants_1.consts.ONTOLOGY.ONT_PERMANENT_PASTURE_LAND, ppId, "Permanent Pasture Land Use for " + country);
            var ppLandRef = objectPropPermPast[constants_1.consts.ONTOLOGY.HAS_PERMANENT_PASTURE_LAND];
            globalStore_1.store.permanentPastureLands[ppId] = ppLandRef;
            globalStore_1.store.landUses[luId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_PERMANENT_PASTURE_LAND, objectPropPermPast));
            ppLandRef.datatypeProperties[constants_1.consts.ONTOLOGY.DT_PERCENTAGE] = percentages[2] || null;
            ppLandRef.datatypeProperties[constants_1.consts.ONTOLOGY.DT_LAST_ESTIMATED] = dates[2] || 'N/A';
        }
    });
}
exports.getLandUses = getLandUses;
;
