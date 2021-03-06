import { entityMaker, entityRefMaker, getRelation } from 'funktologies';
import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';

export function getBorders(cheerioElem: CheerioSelector, country: string, countryId: string) {
    const objectProperties = store.countries[countryId].objectProperties;
    let brdMap = getRelation(objectProperties, consts.ONTOLOGY.HAS_BORDER);
    const brdId = consts.ONTOLOGY.INST_BORDER + getUuid(country);
    let objectProp = {};
    if (!brdMap) {
        if (store.borders[brdId]) {
            objectProp[consts.ONTOLOGY.HAS_BORDER] = store.borders[brdId];
        } else {
            objectProp = entityMaker(
                consts.ONTOLOGY.HAS_BORDER,
                consts.ONTOLOGY.ONT_BORDER,
                brdId,
                `Border of ${country}`);
            store.borders[brdId] = objectProp[consts.ONTOLOGY.HAS_BORDER];
        }
        brdMap = objectProp[consts.ONTOLOGY.HAS_BORDER];
        store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_BORDER, objectProp));
    }
    cheerioElem('#field-land-boundaries').each((indexOut: number, elementOuter: CheerioElement) => {
        cheerioElem(elementOuter).find('div.category_data.subfield.numeric').each((indexIn: number, elementInner: CheerioElement) => {
            const bordGrd = cheerioElem(elementInner).find('span.subfield-number').text().trim();
            if (bordGrd) {
                brdMap.datatypeProperties[consts.ONTOLOGY.DT_TOTAL_BORDER] = Number(bordGrd.replace(/,|[a-z]/g, '').trim()) || null;
            }
            brdMap.datatypeProperties[consts.ONTOLOGY.DT_UNIT] = 'km';
        });
        const numBrdGrd = cheerioElem(elementOuter).find('div.category_data.subfield.text > span.subfield-name').text();
        if (numBrdGrd) {
            const openParam = numBrdGrd.indexOf('(');
            const closeParam = numBrdGrd.indexOf(')');
            const num = (openParam > -1 && -1 < closeParam) ? numBrdGrd.substring(openParam + 1, closeParam) : 0;
            try {
                brdMap.datatypeProperties[consts.ONTOLOGY.DT_TOTAL_BORDER_COUNTRIES] = Number(num);
            } catch (err) {
                store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            }
        }
        let brderContrs = cheerioElem(elementOuter).find('div.category_data.subfield.text').text().trim();
        if (brderContrs) {
            const existBrdContrs = objectProperties.filter(rel => rel[consts.ONTOLOGY.HAS_BORDER_COUNTRY]);
            brderContrs = brderContrs.substring(brderContrs.indexOf(':') + 1).replace(/\\n/g, '').trim();
            const brdrContrsArr = brderContrs.split(',').map(bc => bc.trim());
            brdrContrsArr.forEach(bc => {
                const endingNameIndex = bc.search(/[\d]/g);
                const borderCountry = bc.substring(0, endingNameIndex).trim();
                const endingDistIndex = bc.substring(endingNameIndex).search(/[^\d]/g);
                const distance = bc.substring(endingNameIndex, endingNameIndex + endingDistIndex).trim();
                const orderedContrs = [country, borderCountry].sort();
                const bcId = consts.ONTOLOGY.INST_BORDER_COUNTRY + getUuid(`${orderedContrs[0]}-${orderedContrs[1]}`);

                if (!existBrdContrs.some(brco => brco[consts.ONTOLOGY.HAS_BORDER_COUNTRY]['@id'].includes(bcId))) {
                    let objProp = {};
                    if (store.borderCountries[bcId]) {
                        objProp[consts.ONTOLOGY.HAS_BORDER_COUNTRY] = store.borderCountries[bcId];
                    } else {
                        objProp = entityMaker(
                            consts.ONTOLOGY.HAS_BORDER_COUNTRY,
                            consts.ONTOLOGY.ONT_BORDER_COUNTRY,
                            bcId,
                            `Border Country Pair of ${orderedContrs[0]} and ${orderedContrs[1]}`);

                        objProp[consts.ONTOLOGY.HAS_BORDER_COUNTRY]
                            .datatypeProperties[consts.ONTOLOGY.DT_BORDER_LENGTH] = Number(distance) || null;
                        objProp[consts.ONTOLOGY.HAS_BORDER_COUNTRY]
							.datatypeProperties[consts.ONTOLOGY.DT_UNIT] = 'km';

						const borderCountryObj1 = {}
						borderCountryObj1[consts.ONTOLOGY.HAS_COUNTRY] = {
							'@id': store.countries[countryId]['@id'],
							'@type': store.countries[countryId]['@type']
						};
                        borderCountryObj1[consts.ONTOLOGY.HAS_COUNTRY][consts.RDFS.label] = store.countries[countryId][consts.RDFS.label];
                        objProp[consts.ONTOLOGY.HAS_BORDER_COUNTRY].objectProperties.push(borderCountryObj1);
                        //////// Bail out if counterpart id is not in the system
                        const foundBorderCountry = Object.values(store.countries)
                            .find(c => c['http://www.w3.org/2000/01/rdf-schema#label'].toLowerCase() === borderCountry.toLowerCase());
                        const borderCountryId = foundBorderCountry && foundBorderCountry['@id'];
                        if (!borderCountryId) {
                            return;
                        }
                        ////////
                        const borderCountryObj2 = {}
						borderCountryObj2[consts.ONTOLOGY.HAS_COUNTRY] = {
							'@id': borderCountryId,
							'@type': consts.ONTOLOGY.INST_COUNTRY
                        };
                        borderCountryObj2[consts.ONTOLOGY.HAS_COUNTRY][consts.RDFS.label] = borderCountry;
						objProp[consts.ONTOLOGY.HAS_BORDER_COUNTRY].objectProperties.push(borderCountryObj2);

						store.borderCountries[bcId] = objProp[consts.ONTOLOGY.HAS_BORDER_COUNTRY];
					}
					store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_BORDER_COUNTRY, objProp));
                }
            });
        }
    });
};