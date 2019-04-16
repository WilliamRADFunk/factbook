"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parsed_single_line_caveat_1 = require("./scraper-forms/parsed-single-line-caveat");
function getNaturalHazard(cheerioElem, country, countryId) {
    var bailOut = true;
    cheerioElem('#field-natural-hazards').each(function () {
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
    parsed_single_line_caveat_1.parsedSingleLineCaveat(origParams, '#field-natural-hazards', 'HAS_NATURAL_HAZARD', 'INST_NATURAL_HAZARD', 'ONT_NATURAL_HAZARD', 'naturalHazards', 'DT_HAZARD_DESCRIPTION', 'Natural Hazard', ';', 'volcanism:');
}
exports.getNaturalHazard = getNaturalHazard;
;
