import * as getUuid from 'uuid-by-string';

import { consts } from '../../constants/constants';
import { store } from '../../constants/globalStore';
import { entityMaker } from '../../utils/entity-maker';
import { entityRefMaker } from '../../utils/entity-ref-maker';

export function parsedSingleLineCaveat(
	origParams: { cheerioElem: CheerioSelector; country: string; countryId: string; },
	dataId: string,
	hasProp: string,
	instProp: string,
	baseOntProp: string,
	storeKey: string,
	dataPropName: string,
	label: string,
    delimiter: (string | RegExp),
    upto: string
): void {
	const objectProperties = store.countries[origParams.countryId].objectProperties || [];
	const prevHasList = objectProperties.filter(rel => rel[consts.ONTOLOGY[hasProp]]);
	origParams.cheerioElem(dataId).each((index: number, element: CheerioElement) => {
		const rawScrapedList = origParams.cheerioElem(element).find('div.category_data.subfield.text').text().trim();
        if (rawScrapedList) {
			const splitList = rawScrapedList.substring(0, rawScrapedList.indexOf(upto)).split(delimiter).map(x => x.replace(/\\n/g, '').trim());
			splitList.forEach(resource => {
				const dataPropItem = resource.trim();
				const guid = consts.ONTOLOGY[instProp] + getUuid(dataPropItem);
				const hasPropAlready = prevHasList.some(p => p[consts.ONTOLOGY[hasProp]]['@id'].includes(guid));
				if (dataPropItem && !hasPropAlready) {
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
					objectProp[consts.ONTOLOGY[hasProp]].datatypeProperties[consts.ONTOLOGY[dataPropName]] = dataPropItem;
					store.countries[origParams.countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY[hasProp], objectProp));
				}
			});
        } else {
			return;
		}
	});
};