"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
function countryToId(country) {
    return constants_1.consts.ONTOLOGY.INST_COUNTRY + getUuid(country);
}
exports.countryToId = countryToId;
;
