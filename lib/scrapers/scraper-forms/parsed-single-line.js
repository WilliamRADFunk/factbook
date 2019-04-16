"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../../constants/constants");
var globalStore_1 = require("../../constants/globalStore");
var entity_maker_1 = require("../../utils/entity-maker");
var entity_ref_maker_1 = require("../../utils/entity-ref-maker");
function parsedSingleLine(origParams, dataId, hasProp, instProp, baseOntProp, storeKey, dataPropName, label, delimiter) {
    var objectProperties = globalStore_1.store.countries[origParams.countryId].objectProperties;
    var prevHasList = objectProperties.filter(function (rel) { return rel[constants_1.consts.ONTOLOGY[hasProp]]; });
    origParams.cheerioElem(dataId).each(function (index, element) {
        var rawScrapedList = origParams.cheerioElem(element).find('div.category_data.subfield.text').text().trim();
        if (rawScrapedList) {
            var splitList = rawScrapedList.split(delimiter).map(function (x) { return x.replace(/\\n/g, '').trim(); });
            splitList.forEach(function (resource) {
                var dataPropItem = resource.trim();
                var guid = constants_1.consts.ONTOLOGY[instProp] + getUuid(dataPropItem);
                var hasPropAlready = prevHasList.some(function (p) { return p[constants_1.consts.ONTOLOGY[hasProp]]['@id'].includes(guid); });
                if (dataPropItem && !hasPropAlready) {
                    var objectProp = {};
                    if (globalStore_1.store[storeKey][guid]) {
                        objectProp[constants_1.consts.ONTOLOGY[hasProp]] = globalStore_1.store[storeKey][guid];
                    }
                    else {
                        objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY[hasProp], constants_1.consts.ONTOLOGY[baseOntProp], guid, label + " (" + dataPropItem + ")");
                        globalStore_1.store[storeKey][guid] = objectProp[constants_1.consts.ONTOLOGY[hasProp]];
                    }
                    objectProp[constants_1.consts.ONTOLOGY[hasProp]].datatypeProperties[constants_1.consts.ONTOLOGY[dataPropName]] = dataPropItem;
                    globalStore_1.store.countries[origParams.countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY[hasProp], objectProp));
                }
            });
        }
        else {
            return;
        }
    });
}
exports.parsedSingleLine = parsedSingleLine;
;
