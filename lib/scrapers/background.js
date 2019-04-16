"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
function getBackground(cheerioElem, country, countryId) {
    cheerioElem('#field-background').each(function (index, element) {
        var bckGrd = cheerioElem(element).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (bckGrd) {
            globalStore_1.store.countries[countryId].datatypeProperties[constants_1.consts.ONTOLOGY.DT_BACKGROUND] = bckGrd;
        }
    });
}
exports.getBackground = getBackground;
;
