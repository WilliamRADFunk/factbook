import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';
import { countryToId } from '../utils/country-to-id';

export function getBorders(cheerioElem, country, countryId) {
    const objectProperties = store.countries[countryId].objectProperties;
    let brdMap = getRelation(objectProperties, consts.CUSTOM.HAS_BORDER);
    cheerioElem('#field-land-boundaries').each(function() {
        cheerioElem(this).find('div.category_data.subfield.numeric').each(function() {
            const brdId = consts.CUSTOM.INST_BORDER + getUuid(country);
            let objectProp = {};
            if (!brdMap) {
                if (store.borders[brdId]) {
                    objectProp[consts.CUSTOM.HAS_BORDER] = store.borders[brdId];
                } else {
                    objectProp = entityMaker(
                        consts.CUSTOM.HAS_BORDER,
                        consts.CUSTOM.ONT_BORDER,
                        brdId,
                        `Border of ${country}`);
                    store.borders[brdId] = objectProp[consts.CUSTOM.HAS_BORDER];
                }
                brdMap = objectProp[consts.CUSTOM.HAS_BORDER];
                store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_BORDER, objectProp));
            }
            const bordGrd = cheerioElem(this).find('span.subfield-number').text().trim();
            if (bordGrd) {
                brdMap.datatypeProperties[consts.CUSTOM.TOTAL_BORDER] = bordGrd.replace(/,|[a-z]/g, '').trim();
            }
            brdMap.datatypeProperties[consts.CUSTOM.ONT_UNIT] = 'km';
        });
        const numBrdGrd = cheerioElem(this).find('div.category_data.subfield.text > span.subfield-name').text();
        if (numBrdGrd) {
            const openParam = numBrdGrd.indexOf('(');
            const closeParam = numBrdGrd.indexOf(')');
            const num = (openParam > -1 < closeParam) ? numBrdGrd.substring(openParam + 1, closeParam) : 0;
            try {
                brdMap.datatypeProperties[consts.CUSTOM.TOTAL_BORDER_COUNTRIES] = Number(num);
            } catch (err) {
                store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            }
        }
        let brderContrs = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (brderContrs) {
            const existBrdContrs = objectProperties.filter(rel => rel[consts.CUSTOM.HAS_BORDER_COUNTRY]);
            brderContrs = brderContrs.substring(brderContrs.indexOf(':') + 1).replace(/\\n/g, '').trim();
            const brdrContrsArr = brderContrs.split(',').map(bc => bc.trim());
            brdrContrsArr.forEach(bc => {
                const endingNameIndex = bc.search(/[\d]/g);
                const borderCountry = bc.substring(0, endingNameIndex).trim();
                const endingDistIndex = bc.substring(endingNameIndex).search(/[^\d]/g);
                const distance = bc.substring(endingNameIndex, endingNameIndex + endingDistIndex).trim();
                const orderedContrs = [country, borderCountry].sort();
                const bcId = consts.CUSTOM.INST_BORDER_COUNTRY + getUuid(`${orderedContrs[0]}-${orderedContrs[1]}`);

                if (!existBrdContrs.some(brco => brco[consts.CUSTOM.HAS_BORDER_COUNTRY]['@id'].includes(bcId))) {
                    let objProp = {};
                    if (store.borderCountries[bcId]) {
                        objProp[consts.CUSTOM.HAS_BORDER_COUNTRY] = store.borderCountries[bcId];
                    } else {
                        objProp = entityMaker(
                            consts.CUSTOM.HAS_BORDER_COUNTRY,
                            consts.CUSTOM.ONT_BORDER_COUNTRY,
                            bcId,
                            `Border Country Pair of ${orderedContrs[0]} and ${orderedContrs[1]}`);

                        objProp[consts.CUSTOM.HAS_BORDER_COUNTRY]
                            .datatypeProperties[consts.CUSTOM.BORDER_LENGTH] = distance;
                        objProp[consts.CUSTOM.HAS_BORDER_COUNTRY]
							.datatypeProperties[consts.CUSTOM.ONT_UNIT] = 'km';

						const borderCountryObj1 = {}
						borderCountryObj1[consts.CUSTOM.HAS_COUNTRY] = {
							'@id': store.countries[countryId]['@id'],
							'@type': store.countries[countryId]['@type']
						};
                        borderCountryObj1[consts.CUSTOM.HAS_COUNTRY][consts.RDFS.label] = store.countries[countryId][consts.RDFS.label];
                        objProp[consts.CUSTOM.HAS_BORDER_COUNTRY].objectProperties.push(borderCountryObj1);

						const borderCountryObj2 = {}
						const borderCountryId = countryToId(borderCountry);
						borderCountryObj2[consts.CUSTOM.HAS_COUNTRY] = {
							'@id': borderCountryId,
							'@type': consts.CUSTOM.INST_COUNTRY
                        };
                        borderCountryObj2[consts.CUSTOM.HAS_COUNTRY][consts.RDFS.label] = borderCountry;
						objProp[consts.CUSTOM.HAS_BORDER_COUNTRY].objectProperties.push(borderCountryObj2);

						store.borderCountries[bcId] = objProp[consts.CUSTOM.HAS_BORDER_COUNTRY];
					}
					store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_BORDER_COUNTRY, objProp));
                }
            });
        }
    });
};