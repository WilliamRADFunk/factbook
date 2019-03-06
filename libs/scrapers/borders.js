const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');
const entityMaker = require('../utils/entity-maker.js');
const entityRefMaker = require('../utils/entity-ref-maker.js');
const countryToId = require('../utils/country-to-id.js');

var getBorders = function(cheerioElem, country, countryId) {
    let objectProperties = store.countries[countryId].objectProperties;
    let brdMap = getRelation(objectProperties, consts.CUSTOM.HAS_BORDER);
    cheerioElem('#field-land-boundaries').each(function() {
        cheerioElem(this).find('div.category_data.subfield.numeric').each(function() {
            var brdId = consts.CUSTOM.INST_BORDER + getUuid(country);
            var objectProp = {};
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
            var bordGrd = cheerioElem(this).find('span.subfield-number').text().trim();
            if (bordGrd) {
                brdMap.datatypeProperties[consts.CUSTOM.TOTAL_BORDER] = bordGrd.replace(/,|[a-z]/g, '').trim();
            }
            brdMap.datatypeProperties[consts.CUSTOM.ONT_UNIT] = 'km';
        });
        var numBrdGrd = cheerioElem(this).find('div.category_data.subfield.text > span.subfield-name').text();
        if (numBrdGrd) {
            const openParam = numBrdGrd.indexOf('(');
            const closeParam = numBrdGrd.indexOf(')');
            const num = (openParam > -1 < closeParam) ? numBrdGrd.substring(openParam + 1, closeParam) : 0;
            try {
                brdMap.datatypeProperties[consts.CUSTOM.TOTAL_BORDER_COUNTRIES] = Number(num);
            } catch (err) {
                store.LOG_STREAM.write(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            }
        }
        var brderContrs = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
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

                if (!existBrdContrs.some(brco => brco[consts.CUSTOM.HAS_BORDER_COUNTRY].id.includes(bcId))) {
                    var objProp = {};
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

						var borderCountryObj1 = {}
						borderCountryObj1[consts.CUSTOM.HAS_COUNTRY] = {
							id: store.countries[countryId].id,
							label: store.countries[countryId].label,
							type: store.countries[countryId].type
						};
                        objProp[consts.CUSTOM.HAS_BORDER_COUNTRY].objectProperties.push(borderCountryObj1);

						var borderCountryObj2 = {}
						const borderCountryId = countryToId(borderCountry);
						borderCountryObj2[consts.CUSTOM.HAS_COUNTRY] = {
							id: borderCountryId,
							label: borderCountry,
							type: consts.CUSTOM.INST_COUNTRY
						};
						objProp[consts.CUSTOM.HAS_BORDER_COUNTRY].objectProperties.push(borderCountryObj2);

						store.borderCountries[bcId] = objProp[consts.CUSTOM.HAS_BORDER_COUNTRY];
					}
					store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_BORDER_COUNTRY, objProp));
                }
            });
        }
    });
};

module.exports = getBorders;