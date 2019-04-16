"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
function getPopDist(cheerioElem, country, countryId) {
    cheerioElem('#field-population-distribution').each(function (index, element) {
        var popGrd = cheerioElem(element).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (popGrd) {
            globalStore_1.store.countries[countryId].datatypeProperties[constants_1.consts.ONTOLOGY.DT_POPULATION_DISTRIBUTION] = popGrd;
        }
    });
}
exports.getPopDist = getPopDist;
;
