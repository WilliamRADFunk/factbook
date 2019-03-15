import * as rp from 'request-promise';
import * as cheerio from 'cheerio';

import { consts } from './libs/constants/constants';
import { store } from './libs/constants/globalStore';
import { dataScrapers } from './libs/scrapers/data-getters';
import { entityMaker } from './libs/utils/entity-maker';
import { countryToId } from './libs/utils/country-to-id';
import { loadFiles } from './libs/utils/load-files';
import { saveFiles } from './libs/utils/save-files';

const failedCountries = [];

loadFiles();

const getCountryData = (country, url) => {
    if (country && url) {
        return rp(url, { timeout: consts.BASE.DATA_REQUEST_TIMEOUT })
            .then((html) => {
                const $ = cheerio.load(html);
                const countryId = countryToId(country);
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
                dataScrapers.getElevation($, country, countryId);
                // console.log('getElevation for ', country);
                dataScrapers.getTerrains($, country, countryId);
                console.log('Data scrape for ', country, ' is complete');
            })
            .catch(err => {
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
                store.LOG_STREAM.error(errMsg);
            });
    } else {
        return new Promise(function(resolve) {
            store.LOG_STREAM.error(new Date().toISOString()
                + '\n\nFailure to scrape data for ' + country + ' at \n' + url + '\n\n');
            resolve(null);
        }).then(() => {});
    }
};

const getCountriesData = () => {
    const countryDataPromises = [];
    const countries = store.countriesInList.slice();
    countries.forEach(country => {
        const abbrev = store.countries[countryToId(country)].datatypeProperties[consts.ONTOLOGY.ISO_CODE];
        const url = 'https://www.cia.gov/library/publications/the-world-factbook/geos/' + abbrev + '.html';
        countryDataPromises.push(getCountryData(country, url));
    });
    return countryDataPromises;
};

const promisesResolutionForCountries = () => {
    store.countriesInList.sort();
    const promises = getCountriesData();
    Promise.all(promises)
        .then(function() {
            if (failedCountries.length) {
                console.log('Countries that failed to get parsed: [');
                failedCountries.forEach(c => {
                    console.log(c);
                });
                console.log(']');
                process.stdout.write('Did you want to retry scraping on those failed countries?');
                process.stdin.once('data', function (data) {
                    console.log(`You said: ${data.toString().trim()}`);
                    if (data.toString().trim().toLowerCase().includes('y')) {
                        store.countriesInList = failedCountries.slice();
                        failedCountries.length = 0;
                        promisesResolutionForCountries();
                    } else {
                        saveFiles();
                        process.exit(0);
                    }
                });
                process.stdin.resume();
            } else {
                saveFiles();
                process.exit(0);
            }
        })
        .catch(err => {
            store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
        });
}

rp('https://www.cia.gov/library/publications/the-world-factbook/')
    .then((html) => {
        const $ = cheerio.load(html);
        $('#search-place option').each(function() {
            const a = $(this).prev()
            const countryName = a.text().replace(/\\n/g, ' ').trim();
            const id = countryToId(countryName);
            if (!countryName || store.countries[id] || consts.BASE.COUNTRY_BLACKLIST.includes(countryName.toLowerCase())) {
                // Either already have it, or it's in the invalid list.
            } else {
                store.countriesInList.push(countryName);
                store.countries[id] = entityMaker(
                    consts.ONTOLOGY.HAS_COUNTRY,
                    consts.ONTOLOGY.ONT_COUNTRY,
                    id,
                    countryName)[consts.ONTOLOGY.HAS_COUNTRY];
                store.countries[id].datatypeProperties[consts.ONTOLOGY.ISO_CODE] = a.attr('data-place-code');
            }
        });
        promisesResolutionForCountries();
    })
    .catch(err => {
        store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });