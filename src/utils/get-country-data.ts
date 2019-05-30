import * as cheerio from 'cheerio';
import * as rp from 'request-promise';

import { CountryReference } from 'funktologies';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { dataScrapers } from '../scrapers/data-getters';
import { countryToId } from './country-to-id';

const numberOfScrapers: number = Object.keys(dataScrapers).length;

export function getCountryData(country: CountryReference, url: string): any {
    if (country && url) {
        return rp(url, { timeout: consts.BASE.DATA_REQUEST_TIMEOUT })
            .then((html) => {
                const $ = cheerio.load(html);
                const countryId = countryToId(country.dataCode);
                dataScrapers.getArea($, country.name, countryId);
                store.progressLogger(country.name, 1 / numberOfScrapers);
				dataScrapers.getBackground($, country.name, countryId);
                store.progressLogger(country.name, 2 / numberOfScrapers);
				dataScrapers.getBorderMapImg($, country.name, countryId);
                store.progressLogger(country.name, 3 / numberOfScrapers);
                dataScrapers.getBorders($, country.name, countryId);
                store.progressLogger(country.name, 4 / numberOfScrapers);
                dataScrapers.getClimate($, country.name, countryId);
                store.progressLogger(country.name, 5 / numberOfScrapers);
                dataScrapers.getCoastLength($, country.name, countryId);
                store.progressLogger(country.name, 6 / numberOfScrapers);
                dataScrapers.getElevation($, country.name, countryId);
                store.progressLogger(country.name, 7 / numberOfScrapers);
				dataScrapers.getFlag($, country.name, countryId);
                store.progressLogger(country.name, 8 / numberOfScrapers);
                dataScrapers.getGeographicNotes($, country.name, countryId);
                store.progressLogger(country.name, 9 / numberOfScrapers);
                dataScrapers.getGeography($, country.name, countryId);
                store.progressLogger(country.name, 10 / numberOfScrapers);
                dataScrapers.getGeographyCoordinates($, country.name, countryId);
                store.progressLogger(country.name, 11 / numberOfScrapers);
                dataScrapers.getIrrigatedLand($, country.name, countryId);
                store.progressLogger(country.name, 12 / numberOfScrapers);
                dataScrapers.getLandUses($, country.name, countryId);
                store.progressLogger(country.name, 13 / numberOfScrapers);
                dataScrapers.getMaritimeClaims($, country.name, countryId);
                store.progressLogger(country.name, 14 / numberOfScrapers);
                dataScrapers.getNaturalHazard($, country.name, countryId);
                store.progressLogger(country.name, 15 / numberOfScrapers);
                dataScrapers.getNaturalResources($, country.name, countryId);
                store.progressLogger(country.name, 16 / numberOfScrapers);
                dataScrapers.getPopDist($, country.name, countryId);
                store.progressLogger(country.name, 17 / numberOfScrapers);
				dataScrapers.getRegionMapImg($, country.name, countryId);
                store.progressLogger(country.name, 18 / numberOfScrapers);
                dataScrapers.getSupplementalImages($, country.name, countryId);
                store.progressLogger(country.name, 19 / numberOfScrapers);
                dataScrapers.getTerrains($, country.name, countryId);
                store.progressLogger(country.name, 20 / numberOfScrapers);
                store.debugLogger(`Data scrape for ${country.name} is complete`);
            })
            .catch(err => {
                store.failedCountries.push(country);
                const errMsg = `${
                    new Date().toISOString()
                }\n\nIndividual country query failed:  ${
                country.name}\n${url}\n${err.toString().trim()}\n\n`;
                store.errorLogger(errMsg);
            });
    } else {
        return new Promise(resolve => {
            store.errorLogger(`${
                new Date().toISOString()}\n\nFailure to scrape data for ${
                country.name} at \n${url}\n\n`);
            resolve();
        }).then(() => { /* not empty */ });
    }
};