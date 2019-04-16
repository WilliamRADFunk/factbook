"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
var parsed_single_line_1 = require("./scraper-forms/parsed-single-line");
function getGeographicNotes(cheerioElem, country, countryId) {
    var objectProperties = globalStore_1.store.countries[countryId].objectProperties;
    var prevHasList = objectProperties.filter(function (rel) { return rel[constants_1.consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE]; });
    var bailOut = true;
    cheerioElem('#field-geography-note').each(function () {
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
    var useOptionA = false;
    cheerioElem('#field-geography-note > div.category_data.subfield.text').each(function () {
        useOptionA = true;
    });
    if (useOptionA) {
        var origParams = {
            cheerioElem: cheerioElem,
            country: country,
            countryId: countryId
        };
        parsed_single_line_1.parsedSingleLine(origParams, '#field-geography-note', 'HAS_GEOGRAPHIC_NOTE', 'INST_GEOGRAPHIC_NOTE', 'ONT_GEOGRAPHIC_NOTE', 'geographicNotes', 'DT_DESCRIPTION', 'Geographic Note', ';');
    }
    else {
        cheerioElem('#field-geography-note > div.category_data.note').each(function (index, element) {
            var geographicalNotes = cheerioElem(element).text().trim().replace(/\\n/g, '').trim();
            var notes = geographicalNotes.split(/note [0-9]+\:/);
            if (notes.length) {
                notes.forEach(function (note) {
                    var objectProp = {};
                    var dataPropItem = note.trim();
                    var guid = constants_1.consts.ONTOLOGY.INST_GEOGRAPHIC_NOTE + getUuid(dataPropItem);
                    var hasPropAlready = prevHasList.some(function (p) { return p[constants_1.consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE]['@id'].includes(guid); });
                    if (dataPropItem && !hasPropAlready) {
                        if (globalStore_1.store.geographicNotes[guid]) {
                            objectProp[constants_1.consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE] = globalStore_1.store.geographicNotes[guid];
                        }
                        else {
                            objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE, constants_1.consts.ONTOLOGY.ONT_GEOGRAPHIC_NOTE, guid, "Geographic Note (" + dataPropItem + ")");
                            globalStore_1.store.geographicNotes[guid] = objectProp[constants_1.consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE];
                        }
                        objectProp[constants_1.consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE].datatypeProperties[constants_1.consts.ONTOLOGY.DT_DESCRIPTION] = dataPropItem;
                        globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE, objectProp));
                    }
                });
            }
        });
    }
}
exports.getGeographicNotes = getGeographicNotes;
;
