import * as rp from 'request-promise';
import * as cheerio from 'cheerio';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { entityMaker } from './entity-maker';
import { countryToId } from './country-to-id';

export function getCountries() {
    rp('https://www.cia.gov/library/publications/the-world-factbook/')
    .then((html: string) => {
        const $ = cheerio.load(html);
        $('#search-place option').each((index: number, element: CheerioElement) => {
            const a = $(element).prev()
            const countryName: string = a.text().replace(/\\n/g, ' ').trim();
            const id: string = countryToId(countryName);
            if (!countryName || store.countries[id] || consts.BASE.COUNTRY_BLACKLIST.includes(countryName.toLowerCase())) {
                // Either already have it, or it's in the invalid list.
            } else {
                store.countriesInList.push(countryName);
                store.countries[id] = entityMaker(
                    consts.ONTOLOGY.HAS_COUNTRY,
                    consts.ONTOLOGY.ONT_COUNTRY,
                    id,
                    countryName)[consts.ONTOLOGY.HAS_COUNTRY];
                store.countries[id].datatypeProperties[consts.ONTOLOGY.ISO_CODE] = a.attr('data-place-code');
            }
        });
    })
    .catch((err: Error) => {
        // store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
    });
};