import * as getUuid from 'uuid-by-string';

import { consts } from '../../constants/constants';
import { store } from '../../constants/globalStore';
import { entityMaker } from '../../utils/entity-maker';
import { entityRefMaker } from '../../utils/entity-ref-maker';

export function parsedSingleLine(
	origParams: { cheerioElem: CheerioSelector; country: string; countryId: string; },
	dataId: string,
	hasProp: string,
	instProp: string,
	baseOntProp: string,
	storeKey: string,
	dataPropName: string,
	label: string,
	delimiter: (string | RegExp)
) {
	const objectProperties = store.countries[origParams.countryId].objectProperties;
	const prevHasList = objectProperties.filter(rel => rel[consts.ONTOLOGY[hasProp]]);
	origParams.cheerioElem(dataId).each(function() {
		const rawScrapedList = origParams.cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (rawScrapedList) {
			const splitList = rawScrapedList.split(delimiter).map(x => x.trim());
			splitList.forEach(resource => {
				const dataPropItem = resource.trim();
				const guid = consts.ONTOLOGY[instProp] + getUuid(dataPropItem);
				const hasPropAlready = prevHasList.some(p => p[consts.ONTOLOGY[hasProp]]['@id'].includes(guid));
				if (dataPropItem && dataPropItem !== 'none' && !hasPropAlready) {
					let objectProp = {};
					if (store[storeKey][guid]) {
						objectProp[consts.ONTOLOGY[hasProp]] = store[storeKey][guid];
					} else {
						objectProp = entityMaker(
							consts.ONTOLOGY[hasProp],
							consts.ONTOLOGY[baseOntProp],
							guid,
							`${label} (${dataPropItem})`);
						store[storeKey][guid] = objectProp[consts.ONTOLOGY[hasProp]];
					}
					objectProp[consts.ONTOLOGY[hasProp]].datatypeProperties[dataPropName] = dataPropItem;
					store.countries[origParams.countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY[hasProp], objectProp));
				}
			});
        } else {
			return;
		}
	});
};