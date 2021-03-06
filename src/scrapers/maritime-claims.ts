import { entityMaker, entityRefMaker, getRelation } from 'funktologies';
import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';

export function getMaritimeClaims(cheerioElem: CheerioSelector, country: string, countryId: string) {
	const objectProperties = store.countries[countryId].objectProperties;
	let map = getRelation(objectProperties, consts.ONTOLOGY.HAS_MARITIME_CLAIM);
	const mcId = consts.ONTOLOGY.INST_MARITIME_CLAIM + getUuid(country);
	let objectProp = {};
    let bailOut = true;
    cheerioElem('#field-maritime-claims').each(() => {
		if (!map) {
			if (store.maritimeClaims[mcId]) {
				objectProp[consts.ONTOLOGY.HAS_MARITIME_CLAIM] = store.maritimeClaims[mcId];
			} else {
				objectProp = entityMaker(
					consts.ONTOLOGY.HAS_MARITIME_CLAIM,
					consts.ONTOLOGY.ONT_MARITIME_CLAIM,
					mcId,
					`Maritime Claim for ${country}`);
				store.maritimeClaims[mcId] = objectProp[consts.ONTOLOGY.HAS_MARITIME_CLAIM];
			}
			map = objectProp[consts.ONTOLOGY.HAS_MARITIME_CLAIM];
			store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_MARITIME_CLAIM, objectProp));
		}
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
	cheerioElem('#field-maritime-claims > div.category_data.subfield.numeric').each((index: number, element: CheerioElement) => {
		const seaSwitch = cheerioElem(element).find('span.subfield-name').text().trim();
		const seaData = cheerioElem(element).find('span.subfield-number').text().trim();
		switch (seaSwitch) {
			case 'territorial sea:':
				map.datatypeProperties[consts.ONTOLOGY.DT_TERRITORIAL_SEA] = Number(seaData.replace(/,|[a-z]/g, '').trim()) || null;
				break;
			case 'exclusive economic zone:':
				map.datatypeProperties[consts.ONTOLOGY.DT_EXCLUSIVE_ECONOMIC_ZONE] = Number(seaData.replace(/,|[a-z]/g, '').trim()) || null;
				break;
			case 'contiguous zone:':
				map.datatypeProperties[consts.ONTOLOGY.DT_CONTIGUOUS_ZONE] = Number(seaData.replace(/,|[a-z]/g, '').trim()) || null;
				break;
			case 'exclusive fishing zone:':
				map.datatypeProperties[consts.ONTOLOGY.DT_EXCLUSIVE_FISHING_ZONE] = Number(seaData.replace(/,|[a-z]/g, '').trim()) || null;
				break;
			case 'continental shelf:':
				map.datatypeProperties[consts.ONTOLOGY.DT_CONTINENTAL_SHELF] = Number(seaData.replace(/,|[a-z]/g, '').trim()) || null;
				map.datatypeProperties[consts.ONTOLOGY.DT_CONTINENTAL_SHELF_MODIFIER] = seaData.substring(seaData.indexOf('nm or') + 5).trim();
				break;
		}
	});
	map.datatypeProperties[consts.ONTOLOGY.DT_UNIT] = 'nm';
	cheerioElem('#field-maritime-claims > div.category_data.note').each((index: number, element: CheerioElement) => {
		map.datatypeProperties[consts.ONTOLOGY.DT_SUPPLEMENTAL_EXPLANATION] = cheerioElem(element).text().replace(/\\n/g, ' ').trim();
	});
};