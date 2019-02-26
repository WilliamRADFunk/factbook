const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');

var getCoastLength = function(cheerioElem, country) {
    let objectProperties = store.countries[country].objectProperties;
	let map = getRelation(objectProperties, consts.CUSTOM.HAS_COAST);
	if (!map) {
		var objectProp = {};
		objectProp[consts.CUSTOM.HAS_COAST] = {
			id: consts.CUSTOM.INST_COAST + getUuid(country),
			label: 'hasCoast',
			type: consts.CUSTOM.ONT_COAST,
			datatypeProperties: {},
			objectProperties: []
		};

		map = objectProp[consts.CUSTOM.HAS_COAST];
		store.countries[country].objectProperties.push(objectProp);
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