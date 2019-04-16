import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';
import { getRelation } from '../utils/get-objectProperty';

export function getFlag(cheerioElem, country, countryId) {
    const objectProperties = store.countries[countryId].objectProperties;
	let flag = getRelation(objectProperties, consts.ONTOLOGY.HAS_FLAG);
	const fId = consts.ONTOLOGY.INST_FLAG + getUuid(country);
	let objectProp = {};
    let bailOut = true;
    cheerioElem('div.flagBox').each(() => {
		if (!flag) {
			if (store.nationalFlags[fId]) {
				objectProp[consts.ONTOLOGY.HAS_FLAG] = store.nationalFlags[fId];
			} else {
				objectProp = entityMaker(
					consts.ONTOLOGY.HAS_FLAG,
					consts.ONTOLOGY.ONT_FLAG,
					fId,
					`National Flag of ${country}`);
				store.nationalFlags[fId] = objectProp[consts.ONTOLOGY.HAS_FLAG];
			}
			flag = objectProp[consts.ONTOLOGY.HAS_FLAG];
			store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_FLAG, objectProp));
		}
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
    cheerioElem('div.flagBox').each((index: number, element: CheerioElement) => {
        const a = cheerioElem(element).find('img').attr('src');
        let flagImgUrl;
        if (a && a.replace('../', '')) {
            flagImgUrl = consts.BASE.URL_BASE + a.replace('../', '');
		}
        if (flagImgUrl) {
			flag.datatypeProperties[consts.ONTOLOGY.DT_LOCATOR_URI] = flagImgUrl;
		}
        // TODO: scrape physical image from url and store it.
    });
    cheerioElem('div.modalFlagDesc').each((index: number, element: CheerioElement) => {
        const b = cheerioElem(element).find('div.photogallery_captiontext').text().trim();
        if (!b) { return; }

        if (flag) {
			flag.datatypeProperties[consts.ONTOLOGY.DT_CONTENT_DESCRIPTION] = b.replace(/\\n/g, '').trim();
        } else {
			flag.datatypeProperties[consts.ONTOLOGY.DT_CONTENT_DESCRIPTION] = b.trim();
        }
    });
};