import { store } from './constants/globalStore';
import { flushStore } from './utils/flush-store';
import { getCountries } from './utils/get-countries';
import { getCountryData } from './utils/get-country-data';
import { getCountryURL } from './utils/get-country-url';
import { getImages } from './utils/get-images';
import { loadFiles } from './utils/load-files';
import { saveFiles } from './utils/save-files';

loadFiles();

const getCountriesData = () => {
    const countryDataPromises: Array<Promise<any>> = [];
    const countries = store.countriesInList.slice();
    countries.forEach(country => {
        const url = getCountryURL(country.isoCode);
        countryDataPromises.push(getCountryData(country, url));
    });
    return countryDataPromises;
};

const promisesResolutionForCountries = () => {
    store.countriesInList.sort();
    const promises = getCountriesData();
    Promise.all(promises)
        .then(() => {
            if (store.failedCountries.length) {
                store.debugLogger('Countries that failed to get parsed: [');
                store.failedCountries.forEach(c => {
                    store.debugLogger(c.name);
                });
                store.debugLogger(']');
                process.stdout.write('Did you want to retry scraping on those failed countries? (y/n)');
                process.stdin.once('data', data => {
                    store.debugLogger(`You said: ${data.toString().trim()}`);
                    if (data.toString().trim().toLowerCase().includes('y')) {
                        store.countriesInList = store.failedCountries.slice();
                        store.failedCountries.length = 0;
                        promisesResolutionForCountries();
                    } else {
                        saveFiles();
                        flushStore();
                        getImages();
                    }
                });
                process.stdin.resume();
            } else {
                saveFiles();
                flushStore();
                getImages();
            }
        })
        .catch(err => {
            store.errorLogger(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
        });
}

Promise.all([getCountries()])
    .then(() => {
        promisesResolutionForCountries();
    })
    .catch(err => {
        store.errorLogger(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });

