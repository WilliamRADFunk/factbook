import * as cheerio from 'cheerio';
import * as download from 'image-downloader';
import * as rp from 'request-promise';

import { consts } from './constants/constants';
import { store } from './constants/globalStore';
import { ImageScrapableObject } from './models/image-scrapable-object';
import { dataScrapers } from './scrapers/data-getters';
import { countryToId } from './utils/country-to-id';
import { entityMaker } from './utils/entity-maker';
import { loadFiles } from './utils/load-files';
import { consoleError, consoleLog } from './utils/logger';
import { saveFiles } from './utils/save-files';

const failedCountries: string[] = [];
const failedImages: ImageScrapableObject[] = [];

loadFiles();

const downloadImages = () => {
    const imagePromises: Array<Promise<any>> = [];
    const images = store.IMAGES_TO_SCRAPE.slice();
    images.forEach(img => {
        imagePromises.push(
            download.image(img.options)
                .then(({ filename, image }) => {
                    consoleLog(`File saved to ${filename}`);
                })
                .catch((err) => {
                    consoleError(`~~~~ Failed to download: ${img.fileName}`);
                    failedImages.push(img);
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

function getCountryData(country: string, url: string): any {
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
                dataScrapers.getGeographyCoordinates($, country, countryId);
                dataScrapers.getIrrigatedLand($, country, countryId);
                dataScrapers.getLandUses($, country, countryId);
                dataScrapers.getMaritimeClaims($, country, countryId);
                dataScrapers.getNaturalHazard($, country, countryId);
                dataScrapers.getNaturalResources($, country, countryId);
                dataScrapers.getPopDist($, country, countryId);
				dataScrapers.getRegionMapImg($, country, countryId);
                dataScrapers.getSupplementalImages($, country, countryId);
                dataScrapers.getTerrains($, country, countryId);
                consoleLog(`Data scrape for ${country} is complete`);
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
                // store.LOG_STREAM.error(errMsg);
            });
    } else {
        return new Promise(resolve => {
            // store.LOG_STREAM.error(new Date().toISOString()
            //     + '\n\nFailure to scrape data for ' + country + ' at \n' + url + '\n\n');
            resolve();
        }).then(() => { /* not empty */ });
    }
};

const getCountriesData = () => {
    const countryDataPromises: Array<Promise<any>> = [];
    const countries = store.countriesInList.slice();
    countries.forEach(country => {
        const abbrev = store.countries[countryToId(country)].datatypeProperties[consts.ONTOLOGY.DT_ISO_CODE];
        const url = 'https://www.cia.gov/library/publications/the-world-factbook/geos/' + abbrev + '.html';
        countryDataPromises.push(getCountryData(country, url));
    });
    return countryDataPromises;
};

const promisesResolutionForCountries = () => {
    store.countriesInList.sort();
    const promises = getCountriesData();
    Promise.all(promises)
        .then(() => {
            if (failedCountries.length) {
                consoleLog('Countries that failed to get parsed: [');
                failedCountries.forEach(c => {
                    consoleLog(c);
                });
                consoleLog(']');
                process.stdout.write('Did you want to retry scraping on those failed countries? (y/n)');
                process.stdin.once('data', data => {
                    consoleLog(`You said: ${data.toString().trim()}`);
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
            // store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
        });
}

const scrapeImages = () => {
    const promises = downloadImages();
    Promise.all(promises)
        .then(() => {
            if (failedImages.length) {
                consoleLog('Images that failed download: [');
                failedImages.forEach(c => {
                    consoleLog(c.fileName);
                });
                consoleLog(']');
                store.IMAGES_TO_SCRAPE = failedImages.slice();
                failedImages.length = 0;
                scrapeImages();
            } else {
                process.exit(0);
            }
        })
        .catch(err => {
            // store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
        });
}

rp('https://www.cia.gov/library/publications/the-world-factbook/')
    .then((html) => {
        const $ = cheerio.load(html);
        $('#search-place option').each((index: number, element: CheerioElement) => {
            const a = $(element).prev()
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
                store.countries[id].datatypeProperties[consts.ONTOLOGY.DT_ISO_CODE] = a.attr('data-place-code');
            }
        });
        promisesResolutionForCountries();
    })
    .catch(err => {
        // store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });