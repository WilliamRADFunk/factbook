"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parsed_three_val_strings_1 = require("./scraper-forms/parsed-three-val-strings");
function getIrrigatedLand(cheerioElem, country, countryId) {
    var bailOut = true;
    cheerioElem('#field-natural-resources').each(function () {
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
    parsed_three_val_strings_1.parsedThreeValStrings(origParams, '#field-irrigated-land', 'HAS_ARTIFICIALLY_IRRIGATED_LAND', 'INST_ARTIFICIALLY_IRRIGATED_LAND', 'ONT_ARTIFICIALLY_IRRIGATED_LAND', 'artificiallyIrrigatedLands', ['DT_TOTAL_AREA', 'DT_UNIT', 'DT_LAST_ESTIMATED'], country, 'Artificially Irrigated Land', [/[a-zA-Z]/g, /[^0-9\-\.\,]/g, /\(/g]);
}
exports.getIrrigatedLand = getIrrigatedLand;
;
