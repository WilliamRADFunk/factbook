import { getCountries } from './utils/get-countries';
import { getCountriesData } from './utils/get-countries-data';
import { loadFiles } from './utils/load-files';

loadFiles();

(async () => {
    await getCountries();
    await getCountriesData();
})();