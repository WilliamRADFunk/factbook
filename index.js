const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const getUuid = require('uuid-by-string');

const consts = require('./libs/constants/constants');
const dataScrapers = require('./libs/scrapers/data-getters');


const LOG_FILE_NAME = ('logs/log-' + new Date().toISOString() + '.txt').replace(':', '-');

var countriesFile = { countriesInList: [] };
var rawData;

fs.closeSync(fs.openSync(LOG_FILE_NAME, 'w'));

// If countries file exists, great. Otherwise make a blank one for later.
try {
    rawData = fs.readFileSync('dist/countries.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/countries.json', 'w'));
}
// If preexisting countries file, use it.
if (rawData) {
    countriesFile = JSON.parse(rawData);
}

var getCountryData = (country, url) => {
    if (country && url) {
        return rp(url, { timeout: consts.CUSTOM.DATA_REQUEST_TIMEOUT })
            .then((html) => {
                let $ = cheerio.load(html);
				dataScrapers.getFlag($, country, countriesFile);
				dataScrapers.getBackground($, country, countriesFile);
				dataScrapers.getBorderMapImg($, country, countriesFile);
				dataScrapers.getRegionMapImg($, country, countriesFile);
                dataScrapers.getSupllementalImages($, country, countriesFile);
                dataScrapers.getGeography($, country, countriesFile);
                dataScrapers.getArea($, country, countriesFile);
            })
            .catch(err => {
                fs.appendFileSync(LOG_FILE_NAME, new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            });
    } else {
        return new Promise(function(resolve) {
            resolve(null);
        }).then(() => {});
    }
};

var getCountriesData = () => {
    let countryDataPromises = [];
    let countries = countriesFile.countriesInList.slice();
    countries.forEach(country => {
        let abbrev = countriesFile[country].metaScrapeData['data-place-code'];
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
            if (!countryName || countriesFile[countryName] || consts.CUSTOM.COUNTRY_BLACKLIST.includes(countryName.toLowerCase())) {
                // Either already have it, or it's in the invalid list.
            } else {
                countriesFile.countriesInList.push(countryName);
                countriesFile[countryName] = {
                    id: consts.CUSTOM.MAIN_INSTANCE_PATH + 'country/' + getUuid(countryName),
                    label: countryName,
                    attributes: {},
                    relations: [],
                    metaScrapeData: {
                        'data-place-code': a.attr('data-place-code')
                    }
                };
            }
        });
        countriesFile.countriesInList.sort();
        let promises = getCountriesData();
        Promise.all(promises)
            .then(function() {
                let file = JSON.stringify(countriesFile);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/countries.json', file);
            })
            .catch(err => {
                fs.appendFileSync(LOG_FILE_NAME, new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            });
    })
    .catch(err => {
        fs.appendFileSync(LOG_FILE_NAME, new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });