import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getArea(cheerioElem, country, countryId) {
    const objectProperties = store.countries[countryId].objectProperties;
	let map = getRelation(objectProperties, consts.CUSTOM.HAS_DOMAIN_AREA);
	const daId = consts.CUSTOM.INST_DOMAIN_AREA + getUuid(country);
	let objectProp = {};
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
		const areaSwitch = cheerioElem(this).find('span.subfield-name').text().trim();
		const areaData = cheerioElem(this).find('span.subfield-number').text().trim();
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
        const areaRank = cheerioElem(this).find('a').text().trim();
		if (areaRank) {
			map.datatypeProperties[consts.CUSTOM.ONT_AREA_RANK] = areaRank;
		}
		
	});
	map.datatypeProperties[consts.CUSTOM.ONT_UNIT] = 'sq km';
	cheerioElem('#field-area-comparative').each(function() {
        const areaGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (areaGrd) {
            map.datatypeProperties[consts.CUSTOM.ONT_AREA_COMPARATIVE] = areaGrd;
        }
    });
};