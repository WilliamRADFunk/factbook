const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

const consts = require('./libs/constants/constants');
const store = require('./libs/constants/globalStore');
const dataScrapers = require('./libs/scrapers/data-getters');
const countryToId = require('./libs/utils/country-to-id.js');


const LOG_FILE_NAME = ('logs/log-' + new Date().toISOString() + '.txt').replace(':', '-');
fs.closeSync(fs.openSync(LOG_FILE_NAME, 'w'));

var countriesRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    countriesRawData = fs.readFileSync('dist/countries.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/countries.json', 'w'));
}
// If preexisting countries file, use it.
if (countriesRawData) {
    var countryFile = JSON.parse(countriesRawData);
    store.countries = countryFile.countries;
    store.countriesInList = countryFile.countriesInList;
}

var borderCountriesRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    borderCountriesRawData = fs.readFileSync('dist/borderCountries.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/borderCountries.json', 'w'));
}
// If preexisting borderCountries file, use it.
if (borderCountriesRawData) {
    store.borderCountries = JSON.parse(borderCountriesRawData);
}

var borderMapsRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    borderMapsRawData = fs.readFileSync('dist/borderMaps.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/borderMaps.json', 'w'));
}
// If preexisting borderMaps file, use it.
if (borderMapsRawData) {
    store.borderMaps = JSON.parse(borderMapsRawData);
}

var climatesRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    climatesRawData = fs.readFileSync('dist/climates.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/climates.json', 'w'));
}
// If preexisting climates file, use it.
if (climatesRawData) {
    store.climates = JSON.parse(climatesRawData);
}

var climatesZonesRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    climatesZonesRawData = fs.readFileSync('dist/climatesZones.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/climatesZones.json', 'w'));
}
// If preexisting climatesZones file, use it.
if (climatesZonesRawData) {
    store.climatesZones = JSON.parse(climatesZonesRawData);
}

var coastsRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    coastsRawData = fs.readFileSync('dist/coasts.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/coasts.json', 'w'));
}
// If preexisting coasts file, use it.
if (coastsRawData) {
    store.coasts = JSON.parse(coastsRawData);
}

var domainAreasRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    domainAreasRawData = fs.readFileSync('dist/domainAreas.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/domainAreas.json', 'w'));
}
// If preexisting domainAreas file, use it.
if (domainAreasRawData) {
    store.domainAreas = JSON.parse(domainAreasRawData);
}

var imagesRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    imagesRawData = fs.readFileSync('dist/images.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/images.json', 'w'));
}
// If preexisting images file, use it.
if (imagesRawData) {
    store.images = JSON.parse(imagesRawData);
}

var nationalFlagsRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    nationalFlagsRawData = fs.readFileSync('dist/nationalFlags.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/nationalFlags.json', 'w'));
}
// If preexisting nationalFlags file, use it.
if (nationalFlagsRawData) {
    store.nationalFlags = JSON.parse(nationalFlagsRawData);
}

var regionMapsRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    regionMapsRawData = fs.readFileSync('dist/regionMaps.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/regionMaps.json', 'w'));
}
// If preexisting regionMaps file, use it.
if (regionMapsRawData) {
    store.regionMaps = JSON.parse(regionMapsRawData);
}

var getCountryData = (country, url) => {
    if (country && url) {
        return rp(url, { timeout: consts.CUSTOM.DATA_REQUEST_TIMEOUT })
            .then((html) => {
                let $ = cheerio.load(html);
                var countryId = countryToId(country);
				dataScrapers.getFlag($, country, countryId);
				dataScrapers.getBackground($, country, countryId);
				dataScrapers.getBorderMapImg($, country, countryId);
				dataScrapers.getRegionMapImg($, country, countryId);
                dataScrapers.getSupllementalImages($, country, countryId);
                dataScrapers.getGeography($, country, countryId);
                dataScrapers.getArea($, country, countryId);
                dataScrapers.getCoastLength($, country, countryId);
                dataScrapers.getClimate($, country, countryId);
                console.log('Data scrape for ', country, ' is complete');
            })
            .catch(err => {
                fs.appendFileSync(LOG_FILE_NAME, new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            });
    } else {
        return new Promise(function(resolve) {
            fs.appendFileSync(LOG_FILE_NAME, new Date().toISOString()
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
                store.countries[id] = {
                    id: id,
                    label: countryName,
                    datatypeProperties: {},
                    objectProperties: [],
                    metaScrapeData: {
                        'data-place-code': a.attr('data-place-code')
                    }
                };
            }
        });
        store.countriesInList.sort();
        let promises = getCountriesData();
        Promise.all(promises)
            .then(function() {
                let file = JSON.stringify(store.countries);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/countries.json', file);

                file = JSON.stringify(store.borderCountries);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/borderCountries.json', file);

                file = JSON.stringify(store.borderMaps);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/borderMaps.json', file);

                file = JSON.stringify(store.climates);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/climates.json', file);

                file = JSON.stringify(store.climatesZones);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/climatesZones.json', file);

                file = JSON.stringify(store.coasts);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/coasts.json', file);

                file = JSON.stringify(store.domainAreas);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/domainAreas.json', file);

                file = JSON.stringify(store.images);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/images.json', file);

                file = JSON.stringify(store.nationalFlags);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/nationalFlags.json', file);

                file = JSON.stringify(store.regionMaps);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/regionMaps.json', file);
            })
            .catch(err => {
                fs.appendFileSync(LOG_FILE_NAME, new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            });
    })
    .catch(err => {
        fs.appendFileSync(LOG_FILE_NAME, new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });