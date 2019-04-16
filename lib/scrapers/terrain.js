"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parsed_single_line_1 = require("./scraper-forms/parsed-single-line");
function getTerrains(cheerioElem, country, countryId) {
    var bailOut = true;
    cheerioElem('#field-terrain').each(function () {
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
    var origParams = {
        cheerioElem: cheerioElem,
        country: country,
        countryId: countryId
    };
    parsed_single_line_1.parsedSingleLine(origParams, '#field-terrain', 'HAS_TERRAIN', 'INST_TERRAIN', 'ONT_TERRAIN', 'terrains', 'DT_DESCRIPTION', 'Terrain', ';');
}
exports.getTerrains = getTerrains;
;
