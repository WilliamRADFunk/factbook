"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var rp = require("request-promise");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var country_to_id_1 = require("./country-to-id");
var entity_maker_1 = require("./entity-maker");
function getCountries() {
    rp('https://www.cia.gov/library/publications/the-world-factbook/')
        .then(function (html) {
        var $ = cheerio.load(html);
        $('#search-place option').each(function (index, element) {
            var a = $(element).prev();
            var countryName = a.text().replace(/\\n/g, ' ').trim();
            var id = country_to_id_1.countryToId(countryName);
            if (!countryName || globalStore_1.store.countries[id] || constants_1.consts.BASE.COUNTRY_BLACKLIST.includes(countryName.toLowerCase())) {
                // Either already have it, or it's in the invalid list.
            }
            else {
                globalStore_1.store.countriesInList.push(countryName);
                globalStore_1.store.countries[id] = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_COUNTRY, constants_1.consts.ONTOLOGY.ONT_COUNTRY, id, countryName)[constants_1.consts.ONTOLOGY.HAS_COUNTRY];
                globalStore_1.store.countries[id].datatypeProperties[constants_1.consts.ONTOLOGY.DT_ISO_CODE] = a.attr('data-place-code');
            }
        });
    })
        .catch(function (err) {
        // store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });
}
exports.getCountries = getCountries;
;
