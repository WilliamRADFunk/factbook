import * as rp from 'request-promise';
import * as cheerio from 'cheerio';
import * as download from 'image-downloader';
import * as nodeZip from 'bestzip';

import { consts } from './libs/constants/constants';
import { store } from './libs/constants/globalStore';
import { dataScrapers } from './libs/scrapers/data-getters';
import { entityMaker } from './libs/utils/entity-maker';
import { countryToId } from './libs/utils/country-to-id';
import { loadFiles } from './libs/utils/load-files';
import { saveFiles } from './libs/utils/save-files';

const failedCountries = [];
const failedImages = [];

loadFiles();

const downloadImages = () => {
    const imagePromises = [];
    const images = store.IMAGES_TO_SCRAPE.slice();
    images.forEach(image => {
        imagePromises.push(
            download.image(image.options)
                .then(({ filename, image }) => {
                    console.log('File saved to', filename);
                })
                .catch((err) => {
                    console.error('~~~~ Failed to download: ', image.fileName);
                    failedImages.push(image);
                })
		);
    });
    return imagePromises;
};

const flushStore = () => {
    store.agriculturalLands = {};
	store.arableLands = {};
	store.artificiallyIrrigatedLands = {};
	store.borderCountries = {};
	store.borderMaps = {};
	store.borders = {};
	store.climates = {};
	store.climateZones = {};
	store.coasts = {};
	store.countries = {};
	store.countriesInList = [];
	store.domainAreas = {};
	store.elevations = {};
	store.forestLands = {};
	store.images = {};
	store.geographicNotes = {};
	store.landUses = {};
	store.locations = {};
	store.maritimeClaims = {};
	store.nationalFlags = {};
	store.naturalHazards = {};
	store.naturalResources = {};
	store.otherLands = {};
	store.permanentCropsLands = {};
	store.permanentPastureLands = {};
	store.regionMaps = {};
	store.terrains = {};
};

const getCountryData = (country: string, url: string) => {
    if (country && url) {
        return rp(url, { timeout: consts.BASE.DATA_REQUEST_TIMEOUT })
            .then((html) => {
                const $ = cheerio.load(html);
                const countryId = countryToId(country);
                dataScrapers.getArea($, country, countryId);
				dataScrapers.getBackground($, country, countryId);
				dataScrapers.getBorderMapImg($, country, countryId);
                dataScrapers.getBorders($, country, countryId);
                dataScrapers.getClimate($, country, countryId);
                dataScrapers.getCoastLength($, country, countryId);
                dataScrapers.getElevation($, country, countryId);
				dataScrapers.getFlag($, country, countryId);
                dataScrapers.getGeographicNotes($, country, countryId);
                dataScrapers.getGeography($, country, countryId);
                dataScrapers.getIrrigatedLand($, country, countryId);
                dataScrapers.getLandUses($, country, countryId);
                dataScrapers.getMaritimeClaims($, country, countryId);
                dataScrapers.getNaturalHazard($, country, countryId);
                dataScrapers.getNaturalResources($, country, countryId);
                dataScrapers.getPopDist($, country, countryId);
				dataScrapers.getRegionMapImg($, country, countryId);
                dataScrapers.getSupplementalImages($, country, countryId);
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
                process.stdout.write('Did you want to retry scraping on those failed countries? (y/n)');
                process.stdin.once('data', function (data) {
                    console.log(`You said: ${data.toString().trim()}`);
                    if (data.toString().trim().toLowerCase().includes('y')) {
                        store.countriesInList = failedCountries.slice();
                        failedCountries.length = 0;
                        promisesResolutionForCountries();
                    } else {
                        saveFiles();
                        flushStore();
                        scrapeImages();
                    }
                });
                process.stdin.resume();
            } else {
                saveFiles();
                flushStore();
                scrapeImages();
            }
        })
        .catch(err => {
            store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
        });
}

const scrapeImages = () => {
    const promises = downloadImages();
    Promise.all(promises)
        .then(function() {
            if (failedImages.length) {
                console.log('Images that failed download: [');
                failedImages.forEach(c => {
                    console.log(c.fileName);
                });
                console.log(']');
                process.stdout.write('Did you want to retry downloading on those failed images? (y/n)');
                process.stdin.once('data', function (data) {
                    console.log(`You said: ${data.toString().trim()}`);
                    if (data.toString().trim().toLowerCase().includes('y')) {
                        store.IMAGES_TO_SCRAPE = failedImages.slice();
                        failedImages.length = 0;
                        scrapeImages();
                    } else {
                        process.exit(0);
                    }
                });
                process.stdin.resume();
            } else {
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