const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');

var getArea = function(cheerioElem, country) {
    let objectProperties = store.countries[country].objectProperties;
	let map = getRelation(objectProperties, consts.CUSTOM.HAS_DOMAIN_AREA);
	if (!map) {
		var objectProp = {};
		objectProp[consts.CUSTOM.HAS_DOMAIN_AREA] = {
			id: consts.CUSTOM.INST_DOMAIN_AREA + getUuid(country),
			label: 'hasDomainArea',
			type: consts.CUSTOM.ONT_DOMAIN_AREA,
			datatypeProperties: {},
			objectProperties: []
		};

		map = objectProp[consts.CUSTOM.HAS_DOMAIN_AREA];
		store.countries[country].objectProperties.push(objectProp);
	}
	cheerioElem('#field-area > div.category_data.subfield.numeric').each(function() {
		let areaSwitch = cheerioElem(this).find('span.subfield-name').text().trim();
		let areaData = cheerioElem(this).find('span.subfield-number').text().trim();
		switch (areaSwitch) {
			case 'total:':
				map.datatypeProperties[consts.CUSTOM.ONT_TOTAL_AREA] = areaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'land:':
				map.datatypeProperties[consts.CUSTOM.ONT_LAND_AREA] = areaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'water:':
				map.datatypeProperties[consts.CUSTOM.ONT_WATER_AREA] = areaData.replace(/,|[a-z]/g, '').trim();
				break;
		}
    });
	cheerioElem('#field-area > div > span.category_data').each(function() {
        let areaRank = cheerioElem(this).find('a').text().trim();
		if (areaRank) {
			map.datatypeProperties[consts.CUSTOM.ONT_AREA_RANK] = areaRank;
		}
		
	});
	map.datatypeProperties[consts.CUSTOM.ONT_UNIT] = 'sq km';
	cheerioElem('#field-area-comparative').each(function() {
        var areaGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (areaGrd) {
            map.datatypeProperties[consts.CUSTOM.ONT_AREA_COMPARATIVE] = areaGrd;
        }
    });
};

module.exports = getArea;