"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../../constants/constants");
var globalStore_1 = require("../../constants/globalStore");
var entity_maker_1 = require("../../utils/entity-maker");
var entity_ref_maker_1 = require("../../utils/entity-ref-maker");
function parsedThreeValStrings(origParams, dataId, hasProp, instProp, baseOntProp, storeKey, dataPropNames, country, label, delimiters) {
    var objectProperties = globalStore_1.store.countries[origParams.countryId].objectProperties;
    var prevHasList = objectProperties.filter(function (rel) { return rel[constants_1.consts.ONTOLOGY[hasProp]]; });
    origParams.cheerioElem(dataId).each(function (index, element) {
        var rawScrapedList = origParams.cheerioElem(element).find('div.category_data.subfield.numeric').text().trim().replace(/\\n/g, '');
        if (rawScrapedList) {
            var guid_1 = constants_1.consts.ONTOLOGY[instProp] + getUuid(country);
            var val1 = rawScrapedList.substring(0, rawScrapedList.search(delimiters[0])).trim();
            var val2 = rawScrapedList.substring(rawScrapedList.search(delimiters[1]), rawScrapedList.search(delimiters[2])).trim();
            var val3 = rawScrapedList.substring(rawScrapedList.search(delimiters[2])).trim();
            var hasPropAlready = prevHasList.some(function (p) { return p[constants_1.consts.ONTOLOGY[hasProp]]['@id'].includes(guid_1); });
            if (!hasPropAlready && val1 && val2) {
                var objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY[hasProp], constants_1.consts.ONTOLOGY[baseOntProp], guid_1, label + " for " + country);
                globalStore_1.store[storeKey][guid_1] = objectProp[constants_1.consts.ONTOLOGY[hasProp]];
                objectProp[constants_1.consts.ONTOLOGY[hasProp]].datatypeProperties[constants_1.consts.ONTOLOGY[dataPropNames[0]]] = val1;
                objectProp[constants_1.consts.ONTOLOGY[hasProp]].datatypeProperties[constants_1.consts.ONTOLOGY[dataPropNames[1]]] = val2;
                objectProp[constants_1.consts.ONTOLOGY[hasProp]].datatypeProperties[constants_1.consts.ONTOLOGY[dataPropNames[2]]] = val3 || 'N/A';
                globalStore_1.store.countries[origParams.countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY[hasProp], objectProp));
            }
        }
        else {
            return;
        }
    });
}
exports.parsedThreeValStrings = parsedThreeValStrings;
;
