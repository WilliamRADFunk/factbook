const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');
const entityMaker = require('../utils/entity-maker.js');
const entityRefMaker = require('../utils/entity-ref-maker.js');

var getArea = function(cheerioElem, country, countryId) {
    let objectProperties = store.countries[countryId].objectProperties;
	let map = getRelation(objectProperties, consts.CUSTOM.HAS_DOMAIN_AREA);
	var daId = consts.CUSTOM.INST_DOMAIN_AREA + getUuid(country);
	var objectProp = {};
	if (!map) {
		if (store.domainAreas[daId]) {
			objectProp[consts.CUSTOM.HAS_DOMAIN_AREA] = store.domainAreas[daId];
		} else {
			objectProp = entityMaker(
				consts.CUSTOM.HAS_DOMAIN_AREA,
				consts.CUSTOM.ONT_DOMAIN_AREA,
				daId,
				`Area of Domain for ${country}`);
			store.domainAreas[daId] = objectProp[consts.CUSTOM.HAS_DOMAIN_AREA];
		}
		map = objectProp[consts.CUSTOM.HAS_DOMAIN_AREA];
		store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_DOMAIN_AREA, objectProp));
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