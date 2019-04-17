import { store } from '../constants/globalStore';
import { flushStore } from '../utils/flush-store';
import { getCountryData } from '../utils/get-country-data';
import { getCountryURL } from '../utils/get-country-url';
import { getImages } from '../utils/get-images';
import { saveFiles } from '../utils/save-files';

const createCountriesPromises = () => {
    const countryDataPromises: Array<Promise<any>> = [];
    const countries = store.countriesInList.slice();
    countries.forEach(country => {
        const url = getCountryURL(country.isoCode);
        countryDataPromises.push(getCountryData(country, url));
    });
    return countryDataPromises;
};

export function getCountriesData() {
    store.countriesInList.sort();
    const promises = createCountriesPromises();
    Promise.all(promises)
        .then(() => {
            if (store.failedCountries.length) {
                store.countriesInList = store.failedCountries.slice();
                store.failedCountries.length = 0;
                setTimeout(() => {
                    store.debugLogger('Waiting 3 seconds before retrieving missed countries...');
                    getCountriesData()
                }, 3000);
            } else {
                saveFiles();
                getImages();
                flushStore();
            }
        })
        .catch(err => {
            store.errorLogger(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
        });
}



