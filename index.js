const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');

const consts = require('./libs/constants/constants');
const store = require('./libs/constants/globalStore');
const dataScrapers = require('./libs/scrapers/data-getters');
const entityMaker = require('./libs/utils/entity-maker.js');
const countryToId = require('./libs/utils/country-to-id.js');


const LOG_FILE_NAME = ('logs/log-' + new Date().toISOString() + '.txt').replace(':', '-');
fs.closeSync(fs.openSync(LOG_FILE_NAME, 'w'));
store['LOG_FILE_NAME'] = LOG_FILE_NAME;

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

var borderMapsRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    borderMapsRawData = fs.readFileSync('dist/border-maps.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/border-maps.json', 'w'));
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
    climatesZonesRawData = fs.readFileSync('dist/climates-zones.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/climates-zones.json', 'w'));
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
    domainAreasRawData = fs.readFileSync('dist/domain-areas.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/domain-areas.json', 'w'));
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
    nationalFlagsRawData = fs.readFileSync('dist/national-flags.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/national-flags.json', 'w'));
}
// If preexisting nationalFlags file, use it.
if (nationalFlagsRawData) {
    store.nationalFlags = JSON.parse(nationalFlagsRawData);
}

var regionMapsRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    regionMapsRawData = fs.readFileSync('dist/region-maps.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/region-maps.json', 'w'));
}
// If preexisting regionMaps file, use it.
if (regionMapsRawData) {
    store.regionMaps = JSON.parse(regionMapsRawData);
}

var borderCountriesRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    borderCountriesRawData = fs.readFileSync('dist/border-countries.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/border-countries.json', 'w'));
}
// If preexisting borderCountries file, use it.
if (borderCountriesRawData) {
    store.borderCountries = JSON.parse(borderCountriesRawData);
}

var bordersRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    bordersRawData = fs.readFileSync('dist/borders.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/borders.json', 'w'));
}
// If preexisting borders file, use it.
if (bordersRawData) {
    store.borderCountries = JSON.parse(bordersRawData);
}

var maritimeClaimsRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    maritimeClaimsRawData = fs.readFileSync('dist/maritime-claims.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/maritime-claims.json', 'w'));
}
// If preexisting maritime claims file, use it.
if (maritimeClaimsRawData) {
    store.maritimeClaims = JSON.parse(maritimeClaimsRawData);
}

var naturalResourcesRawData;
// If countries file exists, great. Otherwise make a blank one for later.
try {
    naturalResourcesRawData = fs.readFileSync('dist/natural-resources.json');
} catch (err) {
    fs.closeSync(fs.openSync('dist/natural-resources.json', 'w'));
}
// If preexisting maritime claims file, use it.
if (naturalResourcesRawData) {
    store.naturalResources = JSON.parse(naturalResourcesRawData);
}

var getCountryData = (country, url) => {
    if (country && url) {
        return rp(url, { timeout: consts.CUSTOM.DATA_REQUEST_TIMEOUT })
            .then((html) => {
                let $ = cheerio.load(html);
                var countryId = countryToId(country);
				dataScrapers.getFlag($, country, countryId);
                console.log('getFlag for ', country);
				dataScrapers.getBackground($, country, countryId);
                console.log('getBackground for ', country);
				dataScrapers.getBorderMapImg($, country, countryId);
                console.log('getBorderMapImg for ', country);
				dataScrapers.getRegionMapImg($, country, countryId);
                console.log('getRegionMapImg for ', country);
                dataScrapers.getSupplementalImages($, country, countryId);
                console.log('getSupplementalImages for ', country);
                dataScrapers.getGeography($, country, countryId);
                console.log('getGeography for ', country);
                dataScrapers.getArea($, country, countryId);
                console.log('getArea for ', country);
                dataScrapers.getCoastLength($, country, countryId);
                console.log('getCoastLength for ', country);
                dataScrapers.getClimate($, country, countryId);
                console.log('getClimate for ', country);
                dataScrapers.getBorders($, country, countryId);
                console.log('getBorders for ', country);
                dataScrapers.getMaritimeClaims($, country, countryId);
                console.log('getMaritimeClaims for ', country);
                dataScrapers.getNaturalResources($, country, countryId);
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
                let file = JSON.stringify(store.countries);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/countries.json', file);

                file = JSON.stringify(store.borderCountries);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/border-countries.json', file);

                file = JSON.stringify(store.borderMaps);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/border-maps.json', file);

                file = JSON.stringify([store.climates]);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/climates.json', file);

                file = JSON.stringify(store.climateZones);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/climates-zones.json', file);

                file = JSON.stringify(store.coasts);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/coasts.json', file);

                file = JSON.stringify(store.domainAreas);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/domain-areas.json', file);

                file = JSON.stringify(store.images);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/images.json', file);

                file = JSON.stringify(store.locations);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/locations.json', file);

                file = JSON.stringify(store.nationalFlags);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/national-flags.json', file);

                file = JSON.stringify(store.regionMaps);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/region-maps.json', file);

                file = JSON.stringify(store.borderCountries);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/border-countries.json', file);

                file = JSON.stringify(store.borders);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/borders.json', file);

                file = JSON.stringify(store.maritimeClaims);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/maritime-claims.json', file);

                file = JSON.stringify(store.naturalResources);
                file = file.replace(/\\n/g, ' ');
                fs.writeFileSync('dist/natural-resources.json', file);
            })
            .catch(err => {
                fs.appendFileSync(LOG_FILE_NAME, new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            });
    })
    .catch(err => {
        fs.appendFileSync(LOG_FILE_NAME, new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });