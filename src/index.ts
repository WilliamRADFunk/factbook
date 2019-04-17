import { store } from './constants/globalStore';
import { getCountries } from './utils/get-countries';
import { getCountriesData } from './utils/get-countries-data';
import { loadFiles } from './utils/load-files';

loadFiles();

Promise.all([getCountries()])
    .then(() => {
        getCountriesData();
    })
    .catch(err => {
        store.errorLogger(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });