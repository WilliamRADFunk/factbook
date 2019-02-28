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
                map = objectProp[consts.CUSTOM.HAS_BORDER];
                store.countries[countryId].objectProperties.push(objectProp);
            }
            var bordGrd = cheerioElem(this).find('span.subfield-number').text().trim();
            if (bordGrd) {
                map.datatypeProperties[consts.CUSTOM.TOTAL_BORDER] = bordGrd.replace(/,|[a-z]/g, '').trim();
            }
            map.datatypeProperties[consts.CUSTOM.ONT_UNIT] = 'km';
        });
        var numBrdGrd = cheerioElem(this).find('div.category_data.subfield.text > span.subfield-name').text();
        if (numBrdGrd) {
            const openParam = numBrdGrd.indexOf('(');
            const closeParam = numBrdGrd.indexOf(')');
            const num = numBrdGrd.substring(openParam, closeParam);
            try {
                map.datatypeProperties[consts.CUSTOM.TOTAL_BORDER_COUNTRIES] = Number(num);
            } catch (err) {
                fs.appendFileSync(store['LOG_FILE_NAME'], new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
            }
        }
    });
};

module.exports = getBorders;