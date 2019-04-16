import * as getUuid from 'uuid-by-string';

import { consts } from '../../constants/constants';
import { store } from '../../constants/globalStore';
import { entityMaker } from '../../utils/entity-maker';
import { entityRefMaker } from '../../utils/entity-ref-maker';

export function parsedThreeValStrings(
	origParams: { cheerioElem: CheerioSelector; country: string; countryId: string; },
	dataId: string,
	hasProp: string,
	instProp: string,
	baseOntProp: string,
	storeKey: string,
    dataPropNames: [ string, string, string ],
    country: string,
	label: string,
	delimiters: [ RegExp, RegExp, RegExp ]
): void {
	const objectProperties = store.countries[origParams.countryId].objectProperties;
	const prevHasList = objectProperties.filter(rel => rel[consts.ONTOLOGY[hasProp]]);
	origParams.cheerioElem(dataId).each((index: number, element: CheerioElement) => {
		const rawScrapedList = origParams.cheerioElem(element).find('div.category_data.subfield.numeric').text().trim().replace(/\\n/g, '');
        if (rawScrapedList) {
            const guid = consts.ONTOLOGY[instProp] + getUuid(country);
			const val1 = rawScrapedList.substring(0, rawScrapedList.search(delimiters[0])).trim();
			const val2 = rawScrapedList.substring(rawScrapedList.search(delimiters[1]), rawScrapedList.search(delimiters[2])).trim();
            const val3 = rawScrapedList.substring(rawScrapedList.search(delimiters[2])).trim();
            const hasPropAlready = prevHasList.some(p => p[consts.ONTOLOGY[hasProp]]['@id'].includes(guid));
            if (!hasPropAlready && val1 && val2) {
                const objectProp = entityMaker(
                    consts.ONTOLOGY[hasProp],
                    consts.ONTOLOGY[baseOntProp],
                    guid,
                    `${label} for ${country}`);
                store[storeKey][guid] = objectProp[consts.ONTOLOGY[hasProp]];
                objectProp[consts.ONTOLOGY[hasProp]].datatypeProperties[consts.ONTOLOGY[dataPropNames[0]]] = val1;
                objectProp[consts.ONTOLOGY[hasProp]].datatypeProperties[consts.ONTOLOGY[dataPropNames[1]]] = val2;
                objectProp[consts.ONTOLOGY[hasProp]].datatypeProperties[consts.ONTOLOGY[dataPropNames[2]]] = val3 || 'N/A';
                store.countries[origParams.countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY[hasProp], objectProp));
            }
        } else {
			return;
		}
	});
};