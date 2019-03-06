const rp = require('request-promise');
const cheerio = require('cheerio');

const consts = require('./libs/constants/constants');
const store = require('./libs/constants/globalStore');
const dataScrapers = require('./libs/scrapers/data-getters');
const entityMaker = require('./libs/utils/entity-maker.js');
const countryToId = require('./libs/utils/country-to-id.js');
const loadFiles = require('./libs/utils/load-files.js');
const saveFiles = require('./libs/utils/save-files.js');

const failedCountries = [];

loadFiles();

var getCountryData = (country, url) => {
    if (country && url) {
        return rp(url, { timeout: consts.CUSTOM.DATA_REQUEST_TIMEOUT })
            .then((html) => {
                let $ = cheerio.load(html);
                var countryId = countryToId(country);
				dataScrapers.getFlag($, country, countryId);
                // console.log('getFlag for ', country);
				dataScrapers.getBackground($, country, countryId);
                // console.log('getBackground for ', country);
				dataScrapers.getBorderMapImg($, country, countryId);
                // console.log('getBorderMapImg for ', country);
				dataScrapers.getRegionMapImg($, country, countryId);
                // console.log('getRegionMapImg for ', country);
                dataScrapers.getSupplementalImages($, country, countryId);
                // console.log('getSupplementalImages for ', country);
                dataScrapers.getGeography($, country, countryId);
                // console.log('getGeography for ', country);
                dataScrapers.getArea($, country, countryId);
                // console.log('getArea for ', country);
                dataScrapers.getCoastLength($, country, countryId);
                // console.log('getCoastLength for ', country);
                dataScrapers.getClimate($, country, countryId);
                // console.log('getClimate for ', country);
                dataScrapers.getBorders($, country, countryId);
                // console.log('getBorders for ', country);
                dataScrapers.getMaritimeClaims($, country, countryId);
                // console.log('getMaritimeClaims for ', country);
                dataScrapers.getNaturalResources($, country, countryId);
                // console.log('getNaturalResources for ', country);
                dataScrapers.getTerrains($, country, countryId);
                console.log('Data scrape for ', country, ' is complete');
            })
            .catch(err => {
                console.error('Individual country query failed:', country, url);
                failedCountries.push(country);
                const errMsg = `${
                    new Date().toISOString()
                }\n\nIndividual country query failed:  ${
                    country
                }\n${
                    url
                }\n${
                    err.toString().trim()
                }\n\n`;
                console.log('errMsg', errMsg);
                store.LOG_STREAM.write(errMsg);
            });
    } else {
        return new Promise(function(resolve) {
            console.error('Bad Country or URL:', country, url);
            store.LOG_STREAM.write(new Date().toISOString()
                + '\n\nFailure to scrape data for ' + country + ' at \n' + url + '\n\n');
            resolve(null);
        }).then(() => {});
    }
};

var getCountriesData = () => {
    let countryDataPromises = [];
    let countries = store.countriesInList.slice();
    countries.forEach(country => {
        let abbrev = store.countries[countryToId(country)].metaScrapeData['data-place-code'];
        let url = 'https://www.cia.gov/library/publications/the-world-factbook/geos/' + abbrev + '.html';
        countryDataPromises.push(getCountryData(country, url));
    });
    return countryDataPromises;
};

rp('https://www.cia.gov/library/publications/the-world-factbook/')
    .then((html) => {
        let $ = cheerio.load(html);
        $('#search-place option').each(function() {
            var a = $(this).prev()
            var countryName = a.text().replace(/\\n/g, ' ').trim();
            var id = countryToId(countryName);
            if (!countryName || store.countries[id] || consts.CUSTOM.COUNTRY_BLACKLIST.includes(countryName.toLowerCase())) {
                // Either already have it, or it's in the invalid list.
            } else {
                store.countriesInList.push(countryName);
                store.countries[id] = entityMaker(
                    consts.CUSTOM.HAS_COUNTRY,
                    consts.CUSTOM.ONT_COUNTRY,
                    id,
                    countryName)[consts.CUSTOM.HAS_COUNTRY];
                store.countries[id].metaScrapeData = {
                    'data-place-code': a.attr('data-place-code')
                };
            }
        });
        store.countriesInList.sort();
        let promises = getCountriesData();
        Promise.all(promises)
            .then(function() {
                console.log('Countries that failed to get parsed: [');
                failedCountries.forEach(c => {
                    console.log(c);
                });
                console.log(']');
                saveFiles();
                process.stdout.write('Did you want to retry scraping on those failed countries?');
                process.stdin.once('data', function (data) {
                    console.log(`You said: ${data.toString().trim()}`);
                    process.exit(0);
                });
                process.stdin.resume();
            })
            .catch(err => {
                console.error('Failed to resolve all promises:', err);
                store.LOG_STREAM.write(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            });
    })
    .catch(err => {
        console.error('Failed to retrieve data from world-factbook:', err);
        store.LOG_STREAM.write(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });