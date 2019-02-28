const fs = require('fs');
const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');
const entityMaker = require('../utils/entity-maker.js');

var getBorders = function(cheerioElem, country, countryId) {
    let objectProperties = store.countries[countryId].objectProperties;
    cheerioElem('#field-land-boundaries').each(function() {
        cheerioElem(this).find('div.category_data.subfield.numeric').each(function() {
            let brdMap = getRelation(objectProperties, consts.CUSTOM.HAS_BORDER);
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
                        'hasBorder');
                    store.borders[brdId] = objectProp[consts.CUSTOM.HAS_BORDER];
                }
                brdMap = objectProp[consts.CUSTOM.HAS_BORDER];
                store.countries[countryId].objectProperties.push(objectProp);
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
                fs.appendFileSync(store['LOG_FILE_NAME'], new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
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
                        objectProp = entityMaker(
                            consts.CUSTOM.HAS_BORDER_COUNTRY,
                            consts.CUSTOM.ONT_BORDER_COUNTRY,
                            bcId,
                            'hasBorderCountry');
                        
                        objectProp[consts.CUSTOM.HAS_BORDER_COUNTRY]
                            .datatypeProperties[consts.CUSTOM.BORDER_LENGTH] = distance;
                        objectProp[consts.CUSTOM.HAS_BORDER_COUNTRY]
                            .datatypeProperties[consts.CUSTOM.ONT_UNIT] = 'km';
                        objectProp[consts.CUSTOM.HAS_BORDER_COUNTRY]
                            .objectProperties[consts.CUSTOM.HAS_COUNTRY] = 'km';
                    }
                    store.borderCountries[bcId] = objectProp[consts.CUSTOM.HAS_BORDER_COUNTRY];
                }
            });
        }
    });
};

module.exports = getBorders;