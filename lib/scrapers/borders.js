"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var country_to_id_1 = require("../utils/country-to-id");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
var get_objectProperty_1 = require("../utils/get-objectProperty");
function getBorders(cheerioElem, country, countryId) {
    var objectProperties = globalStore_1.store.countries[countryId].objectProperties;
    var brdMap = get_objectProperty_1.getRelation(objectProperties, constants_1.consts.ONTOLOGY.HAS_BORDER);
    cheerioElem('#field-land-boundaries').each(function (indexOut, elementOuter) {
        cheerioElem(elementOuter).find('div.category_data.subfield.numeric').each(function (indexIn, elementInner) {
            var brdId = constants_1.consts.ONTOLOGY.INST_BORDER + getUuid(country);
            var objectProp = {};
            if (!brdMap) {
                if (globalStore_1.store.borders[brdId]) {
                    objectProp[constants_1.consts.ONTOLOGY.HAS_BORDER] = globalStore_1.store.borders[brdId];
                }
                else {
                    objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_BORDER, constants_1.consts.ONTOLOGY.ONT_BORDER, brdId, "Border of " + country);
                    globalStore_1.store.borders[brdId] = objectProp[constants_1.consts.ONTOLOGY.HAS_BORDER];
                }
                brdMap = objectProp[constants_1.consts.ONTOLOGY.HAS_BORDER];
                globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_BORDER, objectProp));
            }
            var bordGrd = cheerioElem(elementInner).find('span.subfield-number').text().trim();
            if (bordGrd) {
                brdMap.datatypeProperties[constants_1.consts.ONTOLOGY.DT_TOTAL_BORDER] = bordGrd.replace(/,|[a-z]/g, '').trim();
            }
            brdMap.datatypeProperties[constants_1.consts.ONTOLOGY.DT_UNIT] = 'km';
        });
        var numBrdGrd = cheerioElem(elementOuter).find('div.category_data.subfield.text > span.subfield-name').text();
        if (numBrdGrd) {
            var openParam = numBrdGrd.indexOf('(');
            var closeParam = numBrdGrd.indexOf(')');
            var num = (openParam > -1 && -1 < closeParam) ? numBrdGrd.substring(openParam + 1, closeParam) : 0;
            try {
                brdMap.datatypeProperties[constants_1.consts.ONTOLOGY.DT_TOTAL_BORDER_COUNTRIES] = Number(num);
            }
            catch (err) {
                // store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            }
        }
        var brderContrs = cheerioElem(elementOuter).find('div.category_data.subfield.text').text().trim();
        if (brderContrs) {
            var existBrdContrs_1 = objectProperties.filter(function (rel) { return rel[constants_1.consts.ONTOLOGY.HAS_BORDER_COUNTRY]; });
            brderContrs = brderContrs.substring(brderContrs.indexOf(':') + 1).replace(/\\n/g, '').trim();
            var brdrContrsArr = brderContrs.split(',').map(function (bc) { return bc.trim(); });
            brdrContrsArr.forEach(function (bc) {
                var endingNameIndex = bc.search(/[\d]/g);
                var borderCountry = bc.substring(0, endingNameIndex).trim();
                var endingDistIndex = bc.substring(endingNameIndex).search(/[^\d]/g);
                var distance = bc.substring(endingNameIndex, endingNameIndex + endingDistIndex).trim();
                var orderedContrs = [country, borderCountry].sort();
                var bcId = constants_1.consts.ONTOLOGY.INST_BORDER_COUNTRY + getUuid(orderedContrs[0] + "-" + orderedContrs[1]);
                if (!existBrdContrs_1.some(function (brco) { return brco[constants_1.consts.ONTOLOGY.HAS_BORDER_COUNTRY]['@id'].includes(bcId); })) {
                    var objProp = {};
                    if (globalStore_1.store.borderCountries[bcId]) {
                        objProp[constants_1.consts.ONTOLOGY.HAS_BORDER_COUNTRY] = globalStore_1.store.borderCountries[bcId];
                    }
                    else {
                        objProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_BORDER_COUNTRY, constants_1.consts.ONTOLOGY.ONT_BORDER_COUNTRY, bcId, "Border Country Pair of " + orderedContrs[0] + " and " + orderedContrs[1]);
                        objProp[constants_1.consts.ONTOLOGY.HAS_BORDER_COUNTRY]
                            .datatypeProperties[constants_1.consts.ONTOLOGY.DT_BORDER_LENGTH] = distance;
                        objProp[constants_1.consts.ONTOLOGY.HAS_BORDER_COUNTRY]
                            .datatypeProperties[constants_1.consts.ONTOLOGY.DT_UNIT] = 'km';
                        var borderCountryObj1 = {};
                        borderCountryObj1[constants_1.consts.ONTOLOGY.HAS_COUNTRY] = {
                            '@id': globalStore_1.store.countries[countryId]['@id'],
                            '@type': globalStore_1.store.countries[countryId]['@type']
                        };
                        borderCountryObj1[constants_1.consts.ONTOLOGY.HAS_COUNTRY][constants_1.consts.RDFS.label] = globalStore_1.store.countries[countryId][constants_1.consts.RDFS.label];
                        objProp[constants_1.consts.ONTOLOGY.HAS_BORDER_COUNTRY].objectProperties.push(borderCountryObj1);
                        var borderCountryObj2 = {};
                        var borderCountryId = country_to_id_1.countryToId(borderCountry);
                        borderCountryObj2[constants_1.consts.ONTOLOGY.HAS_COUNTRY] = {
                            '@id': borderCountryId,
                            '@type': constants_1.consts.ONTOLOGY.INST_COUNTRY
                        };
                        borderCountryObj2[constants_1.consts.ONTOLOGY.HAS_COUNTRY][constants_1.consts.RDFS.label] = borderCountry;
                        objProp[constants_1.consts.ONTOLOGY.HAS_BORDER_COUNTRY].objectProperties.push(borderCountryObj2);
                        globalStore_1.store.borderCountries[bcId] = objProp[constants_1.consts.ONTOLOGY.HAS_BORDER_COUNTRY];
                    }
                    globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_BORDER_COUNTRY, objProp));
                }
            });
        }
    });
}
exports.getBorders = getBorders;
;
