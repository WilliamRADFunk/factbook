"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var download = require("image-downloader");
var rp = require("request-promise");
var constants_1 = require("./constants/constants");
var globalStore_1 = require("./constants/globalStore");
var data_getters_1 = require("./scrapers/data-getters");
var country_to_id_1 = require("./utils/country-to-id");
var entity_maker_1 = require("./utils/entity-maker");
var load_files_1 = require("./utils/load-files");
var logger_1 = require("./utils/logger");
var save_files_1 = require("./utils/save-files");
var failedCountries = [];
var failedImages = [];
load_files_1.loadFiles();
var downloadImages = function () {
    var imagePromises = [];
    var images = globalStore_1.store.IMAGES_TO_SCRAPE.slice();
    images.forEach(function (img) {
        imagePromises.push(download.image(img.options)
            .then(function (_a) {
            var filename = _a.filename, image = _a.image;
            logger_1.consoleLog("File saved to " + filename);
        })
            .catch(function (err) {
            logger_1.consoleError("~~~~ Failed to download: " + img.fileName);
            failedImages.push(img);
        }));
    });
    return imagePromises;
};
var flushStore = function () {
    globalStore_1.store.agriculturalLands = {};
    globalStore_1.store.arableLands = {};
    globalStore_1.store.artificiallyIrrigatedLands = {};
    globalStore_1.store.borderCountries = {};
    globalStore_1.store.borderMaps = {};
    globalStore_1.store.borders = {};
    globalStore_1.store.climates = {};
    globalStore_1.store.climateZones = {};
    globalStore_1.store.coasts = {};
    globalStore_1.store.countries = {};
    globalStore_1.store.countriesInList = [];
    globalStore_1.store.domainAreas = {};
    globalStore_1.store.elevations = {};
    globalStore_1.store.forestLands = {};
    globalStore_1.store.images = {};
    globalStore_1.store.geographicNotes = {};
    globalStore_1.store.landUses = {};
    globalStore_1.store.locations = {};
    globalStore_1.store.maritimeClaims = {};
    globalStore_1.store.nationalFlags = {};
    globalStore_1.store.naturalHazards = {};
    globalStore_1.store.naturalResources = {};
    globalStore_1.store.otherLands = {};
    globalStore_1.store.permanentCropsLands = {};
    globalStore_1.store.permanentPastureLands = {};
    globalStore_1.store.regionMaps = {};
    globalStore_1.store.terrains = {};
};
function getCountryData(country, url) {
    if (country && url) {
        return rp(url, { timeout: constants_1.consts.BASE.DATA_REQUEST_TIMEOUT })
            .then(function (html) {
            var $ = cheerio.load(html);
            var countryId = country_to_id_1.countryToId(country);
            data_getters_1.dataScrapers.getArea($, country, countryId);
            data_getters_1.dataScrapers.getBackground($, country, countryId);
            data_getters_1.dataScrapers.getBorderMapImg($, country, countryId);
            data_getters_1.dataScrapers.getBorders($, country, countryId);
            data_getters_1.dataScrapers.getClimate($, country, countryId);
            data_getters_1.dataScrapers.getCoastLength($, country, countryId);
            data_getters_1.dataScrapers.getElevation($, country, countryId);
            data_getters_1.dataScrapers.getFlag($, country, countryId);
            data_getters_1.dataScrapers.getGeographicNotes($, country, countryId);
            data_getters_1.dataScrapers.getGeography($, country, countryId);
            data_getters_1.dataScrapers.getGeographyCoordinates($, country, countryId);
            data_getters_1.dataScrapers.getIrrigatedLand($, country, countryId);
            data_getters_1.dataScrapers.getLandUses($, country, countryId);
            data_getters_1.dataScrapers.getMaritimeClaims($, country, countryId);
            data_getters_1.dataScrapers.getNaturalHazard($, country, countryId);
            data_getters_1.dataScrapers.getNaturalResources($, country, countryId);
            data_getters_1.dataScrapers.getPopDist($, country, countryId);
            data_getters_1.dataScrapers.getRegionMapImg($, country, countryId);
            data_getters_1.dataScrapers.getSupplementalImages($, country, countryId);
            data_getters_1.dataScrapers.getTerrains($, country, countryId);
            logger_1.consoleLog("Data scrape for " + country + " is complete");
        })
            .catch(function (err) {
            failedCountries.push(country);
            var errMsg = new Date().toISOString() + "\n\nIndividual country query failed:  " + country + "\n" + url + "\n" + err.toString().trim() + "\n\n";
            // store.LOG_STREAM.error(errMsg);
        });
    }
    else {
        return new Promise(function (resolve) {
            // store.LOG_STREAM.error(new Date().toISOString()
            //     + '\n\nFailure to scrape data for ' + country + ' at \n' + url + '\n\n');
            resolve();
        }).then(function () { });
    }
}
;
var getCountriesData = function () {
    var countryDataPromises = [];
    var countries = globalStore_1.store.countriesInList.slice();
    countries.forEach(function (country) {
        var abbrev = globalStore_1.store.countries[country_to_id_1.countryToId(country)].datatypeProperties[constants_1.consts.ONTOLOGY.DT_ISO_CODE];
        var url = 'https://www.cia.gov/library/publications/the-world-factbook/geos/' + abbrev + '.html';
        countryDataPromises.push(getCountryData(country, url));
    });
    return countryDataPromises;
};
var promisesResolutionForCountries = function () {
    globalStore_1.store.countriesInList.sort();
    var promises = getCountriesData();
    Promise.all(promises)
        .then(function () {
        if (failedCountries.length) {
            logger_1.consoleLog('Countries that failed to get parsed: [');
            failedCountries.forEach(function (c) {
                logger_1.consoleLog(c);
            });
            logger_1.consoleLog(']');
            process.stdout.write('Did you want to retry scraping on those failed countries? (y/n)');
            process.stdin.once('data', function (data) {
                logger_1.consoleLog("You said: " + data.toString().trim());
                if (data.toString().trim().toLowerCase().includes('y')) {
                    globalStore_1.store.countriesInList = failedCountries.slice();
                    failedCountries.length = 0;
                    promisesResolutionForCountries();
                }
                else {
                    save_files_1.saveFiles();
                    flushStore();
                    scrapeImages();
                }
            });
            process.stdin.resume();
        }
        else {
            save_files_1.saveFiles();
            flushStore();
            scrapeImages();
        }
    })
        .catch(function (err) {
        // store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });
};
var scrapeImages = function () {
    var promises = downloadImages();
    Promise.all(promises)
        .then(function () {
        if (failedImages.length) {
            logger_1.consoleLog('Images that failed download: [');
            failedImages.forEach(function (c) {
                logger_1.consoleLog(c.fileName);
            });
            logger_1.consoleLog(']');
            globalStore_1.store.IMAGES_TO_SCRAPE = failedImages.slice();
            failedImages.length = 0;
            scrapeImages();
        }
        else {
            process.exit(0);
        }
    })
        .catch(function (err) {
        // store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });
};
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
    promisesResolutionForCountries();
})
    .catch(function (err) {
    // store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
});
