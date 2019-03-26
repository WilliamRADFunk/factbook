import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getFlag(cheerioElem, country, countryId) {
    const objectProperties = store.countries[countryId].objectProperties;
	let flag = getRelation(objectProperties, consts.ONTOLOGY.HAS_FLAG);
	const fId = consts.ONTOLOGY.INST_FLAG + getUuid(country);
	let objectProp = {};
    let bailOut = true;
    cheerioElem('div.flagBox').each(function() {
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
    cheerioElem('div.flagBox').each(function() {
        const a = cheerioElem(this).find('img').attr('src');
        let flagImgUrl;
        if (a && a.replace('../', '')) {
            flagImgUrl = consts.BASE.URL_BASE + a.replace('../', '');
		}
        if (flagImgUrl) {
			flag.datatypeProperties[consts.ONTOLOGY.LOCATOR_URI] = flagImgUrl;
		}
        // TODO: scrape physical image from url and store it.
    });
    cheerioElem('div.modalFlagDesc').each(function() {
        const b = cheerioElem(this).find('div.photogallery_captiontext').text().trim();
        if (!b) { return; }

        if (flag) {
			flag.datatypeProperties[consts.ONTOLOGY.CONTENT_DESCRIPTION] = b.replace(/\\n/g, '').trim();
        } else {
			flag.datatypeProperties[consts.ONTOLOGY.CONTENT_DESCRIPTION] = b.trim();
        }
    });
};