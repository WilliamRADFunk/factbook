const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const getUuid = require('uuid-by-string');

const URL_BASE = 'https://www.cia.gov/library/publications/the-world-factbook/';
const MAIN_ONT_PATH = 'https://www.funk.com/ont/';
const DATA_REQUEST_TIMEOUT = 10000;
const COUNTRY_BLACKLIST = [
    "please select a country to view",
    "world"
];
const LOG_FILE_NAME = ('logs/log-' + new Date().toISOString() + '.txt').replace(':', '-');

var countriesFile = { countriesInList: [] };
var rawData;

fs.closeSync(fs.openSync(LOG_FILE_NAME, 'w'));

// If countries file exists, great. Otherwise make a blank one for later.
try {
    rawData = fs.readFileSync('countries.json');
} catch (err) {
    fs.closeSync(fs.openSync('countries.json', 'w'));
}
// If preexisting countries file, use it.
if (rawData) {
    countriesFile = JSON.parse(rawData);
}

var getCountryData = (country, url) => {
    if (country && url) {
        return rp(url, { timeout: DATA_REQUEST_TIMEOUT })
            .then((html) => {
                let $ = cheerio.load(html);
                getFlag($, country);
            })
            .catch(err => {
                fs.appendFileSync(LOG_FILE_NAME, new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            });
    } else {
        return new Promise(function(resolve, reject) {
            resolve(null);
        }).then(dontCare => {});
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

function hasProp(base, propName) {
    if (!propName[0]) {
        return base;
    } else if (base && !base[propName[0]]) {
        return undefined;
    }
    return hasProp(base[propName[0]], propName.slice(1));
}

function getRelation(relationList, propName) {
    let propNameChain = Array.isArray(propName) ? propName : [propName];
    let rel = relationList.find(rel => { return hasProp(rel, propNameChain); });
    return rel && rel[propNameChain[0]];
};

var getFlag = (cheerioElem, country) => {
    let relations = countriesFile[country].relations;
    cheerioElem('div.flagBox').each(function(i, element) {
        let flag = getRelation(relations, 'hasFlag');
        if (flag && flag.hasSourceURL) {
            return;
        }

        var a = cheerioElem(this).find('img').attr('src');
        var flagImgUrl;
        if (a && a.replace('../', '')) {
            flagImgUrl = URL_BASE + a.replace('../', '');
        }
        if (flagImgUrl) {
            countriesFile[country].relations.push({
                hasFlag: {
                    id: MAIN_ONT_PATH + 'flag/' + getUuid(country),
                    label: country + '\'s national flag',
                    description: null,
                    hasSourceURL: flagImgUrl
                }
            });
        }
        // TODO: scrape physical image from url and store it.
    });
    cheerioElem('div.modalFlagDesc').each(function(i, element) {
        let flag = getRelation(relations, 'hasFlag');
        if (flag && flag.description) {
            return;
        }
    
        var a = cheerioElem(this).find('div.photogallery_captiontext').text();
        if (!a) {
            return;
        }

        if (flag) {
            flag.description = a.trim();
        } else {
            countriesFile[country].relations.push({
                hasFlag: {
                    id: MAIN_ONT_PATH + 'flag/' + getUuid(country),
                    label: country + '\'s national flag',
                    description: a.trim(),
                    hasSourceURL: null
                }
            });
        }
    });
}

rp('https://www.cia.gov/library/publications/the-world-factbook/')
    .then((html) => {
        let $ = cheerio.load(html);
        $('#search-place option').each(function(i, element) {
            var a = $(this).prev()
            var countryName = a.text().replace('\n', '').trim();
            if (!countryName || countriesFile[countryName] || COUNTRY_BLACKLIST.includes(countryName.toLowerCase())) {
                // Either already have it, or it's in the invalid list.
            } else {
                countriesFile.countriesInList.push(countryName);
                countriesFile[countryName] = {
                    id: MAIN_ONT_PATH + 'country/' + getUuid(countryName),
                    label: countryName,
                    attributes: [],
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
            .then(function(values) {
                fs.writeFileSync('countries.json', JSON.stringify(countriesFile));
            })
            .catch(err => {
                fs.appendFileSync(LOG_FILE_NAME, new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            });
    })
    .catch(err => {
        fs.appendFileSync(LOG_FILE_NAME, new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });