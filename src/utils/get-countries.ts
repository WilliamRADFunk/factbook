import * as cheerio from 'cheerio';
import * as rp from 'request-promise';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { countryToId } from './country-to-id';
import { dataCodeToIsoCode } from './country-code-lookup-tables';
import { entityMaker } from './entity-maker';

export async function getCountries(): Promise<any> {
    return await rp('https://www.cia.gov/library/publications/the-world-factbook/')
        .then((html: string) => {
            const $ = cheerio.load(html);
            const cNames = $('#search-place option').toArray()
                .map(c => {
                    const dCode = $(c).prev().attr('data-place-code')
                    return {
                        dataCode: dCode,
                        isoCode: dataCodeToIsoCode(dCode),
                        name: $(c).prev().text().replace(/\\n/g, ' ').trim()
                    };
                })
                .filter(country => !!country.name && !consts.BASE.COUNTRY_BLACKLIST.includes(country.name.toLowerCase()));
            
            store.countriesInList.push(...cNames);

            store.countriesInList.forEach(country => {
                const id: string = countryToId(country.dataCode);
                store.countries[id] = entityMaker(
                    consts.ONTOLOGY.HAS_COUNTRY,
                    consts.ONTOLOGY.ONT_COUNTRY,
                    id,
                    country.name)[consts.ONTOLOGY.HAS_COUNTRY];
                    store.countries[id].datatypeProperties[consts.ONTOLOGY.DT_GEC_CODE] = country.dataCode;
                    store.countries[id].datatypeProperties[consts.ONTOLOGY.DT_ISO_CODE] = country.isoCode;
            });
        })
        .catch((err: Error) => {
            store.errorLogger(new Date().toISOString() + '\n\ngetCountries\n\n' + err.toString() + '\n\n');
        });
};