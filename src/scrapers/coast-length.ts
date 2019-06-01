import { entityMaker, entityRefMaker, getRelation } from 'funktologies';
import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';

export function getCoastLength(cheerioElem: CheerioSelector, country: string, countryId: string) {
    const objectProperties = store.countries[countryId].objectProperties;
	let map = getRelation(objectProperties, consts.ONTOLOGY.HAS_COAST);
	const clId = consts.ONTOLOGY.INST_COAST + getUuid(country);
	let objectProp = {};
    let bailOut = true;
    cheerioElem('#field-coastline').each(() => {
		if (!map) {
			if (store.coasts[clId]) {
				objectProp[consts.ONTOLOGY.HAS_COAST] = store.coasts[clId];
			} else {
				objectProp = entityMaker(
					consts.ONTOLOGY.HAS_COAST,
					consts.ONTOLOGY.ONT_COAST,
					clId,
					`Coast of ${country}`);
				store.coasts[clId] = objectProp[consts.ONTOLOGY.HAS_COAST];
			}
			map = objectProp[consts.ONTOLOGY.HAS_COAST];
			store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_COAST, objectProp));
		}
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
	cheerioElem('#field-coastline').each((index: number, element: CheerioElement) => {
        const coastGrd = cheerioElem(element).find('div.category_data.subfield.numeric').text().trim()
        if (coastGrd) {
			const coastGrdSplit = coastGrd.split('km');
			map.datatypeProperties[consts.ONTOLOGY.DT_LENGTH] = Number(coastGrdSplit[0].trim()) || null;
			map.datatypeProperties[consts.ONTOLOGY.DT_LENGTH_MODIFIER] = coastGrdSplit.slice(1).join('km').replace(/\\n/g, '').trim() || null;
        }
	});
	map.datatypeProperties[consts.ONTOLOGY.DT_UNIT] = 'km';
};