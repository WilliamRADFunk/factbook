import * as cheerio from 'cheerio';
import * as rp from 'request-promise';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { countryToId } from './country-to-id';
import { entityMaker } from './entity-maker';

export function getCountries(): any {
    return rp('https://www.cia.gov/library/publications/the-world-factbook/')
        .then((html: string) => {
            const $ = cheerio.load(html);
            const cNames = $('#search-place option').toArray()
                .map(c => {
                    return {
                        isoCode: $(c).prev().attr('data-place-code'),
                        name: $(c).prev().text().replace(/\\n/g, ' ').trim()
                    };
                })
                .filter(country => !!country.name && !consts.BASE.COUNTRY_BLACKLIST.includes(country.name.toLowerCase()));
            
            store.countriesInList.push(...cNames);

            store.countriesInList.forEach(country => {
                const id: string = countryToId(country.name);
                store.countries[id] = entityMaker(
                    consts.ONTOLOGY.HAS_COUNTRY,
                    consts.ONTOLOGY.ONT_COUNTRY,
                    id,
                    country.name)[consts.ONTOLOGY.HAS_COUNTRY];
                    store.countries[id].datatypeProperties[consts.ONTOLOGY.DT_ISO_CODE] = country.isoCode;
            });
        })
        .catch((err: Error) => {
            store.errorLogger(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
        });
};