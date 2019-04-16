"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parsed_single_line_1 = require("./scraper-forms/parsed-single-line");
function getNaturalResources(cheerioElem, country, countryId) {
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
    parsed_single_line_1.parsedSingleLine(origParams, '#field-natural-resources', 'HAS_NATURAL_RESOURCE', 'INST_NATURAL_RESOURCE', 'ONT_NATURAL_RESOURCE', 'naturalResources', 'DT_RESOURCE_NAME', 'Natural Resource', ',');
}
exports.getNaturalResources = getNaturalResources;
;
