const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty');
const entityMaker = require('../utils/entity-maker');
const entityRefMaker = require('../utils/entity-ref-maker.js');

var getCoastLength = function(cheerioElem, country, countryId) {
    let objectProperties = store.countries[countryId].objectProperties;
	let map = getRelation(objectProperties, consts.CUSTOM.HAS_COAST);
	var clId = consts.CUSTOM.INST_COAST + getUuid(country);
	var objectProp = {};
	if (!map) {
		if (store.coasts[clId]) {
			objectProp[consts.CUSTOM.HAS_COAST] = store.coasts[clId];
		} else {
			objectProp = entityMaker(
				consts.CUSTOM.HAS_COAST,
				consts.CUSTOM.ONT_COAST,
				clId,
				`Coast of ${country}`);
			store.coasts[clId] = objectProp[consts.CUSTOM.HAS_COAST];
		}
		map = objectProp[consts.CUSTOM.HAS_COAST];
		store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_COAST, objectProp));
	}
	cheerioElem('#field-coastline').each(function() {
        var coastGrd = cheerioElem(this).find('div.category_data.subfield.numeric').text().trim()
        if (coastGrd) {
			coastGrdSplit = coastGrd.split('km');
			map.datatypeProperties[consts.CUSTOM.ONT_LENGTH] = coastGrdSplit[0].trim();
			map.datatypeProperties[consts.CUSTOM.ONT_LENGTH_MODIFIER] = coastGrdSplit.slice(1).join('km').replace(/\\n/g, '').trim() || null;
        }
	});
	map.datatypeProperties[consts.CUSTOM.ONT_UNIT] = 'km';
};

module.exports = getCoastLength;