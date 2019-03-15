import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getFlag(cheerioElem, country, countryId) {
    const objectProperties = store.countries[countryId].objectProperties;
	let flag = getRelation(objectProperties, consts.CUSTOM.HAS_FLAG);
	const fId = consts.CUSTOM.INST_FLAG + getUuid(country);
	let objectProp = {};
	if (!flag) {
		if (store.nationalFlags[fId]) {
			objectProp[consts.CUSTOM.HAS_FLAG] = store.nationalFlags[fId];
		} else {
			objectProp = entityMaker(
				consts.CUSTOM.HAS_FLAG,
				consts.CUSTOM.ONT_FLAG,
				fId,
				`National Flag of ${country}`);
			store.nationalFlags[fId] = objectProp[consts.CUSTOM.HAS_FLAG];
		}
		flag = objectProp[consts.CUSTOM.HAS_FLAG];
		store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_FLAG, objectProp));
	}
    cheerioElem('div.flagBox').each(function() {
        const a = cheerioElem(this).find('img').attr('src');
        let flagImgUrl;
        if (a && a.replace('../', '')) {
            flagImgUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
		}
        if (flagImgUrl) {
			flag.datatypeProperties[consts.CUSTOM.LOCATION_URI] = flagImgUrl;
		}
        // TODO: scrape physical image from url and store it.
    });
    cheerioElem('div.modalFlagDesc').each(function() {
        const b = cheerioElem(this).find('div.photogallery_captiontext').text().trim();
        if (!b) { return; }

        if (flag) {
			flag.datatypeProperties[consts.CUSTOM.CONTENT_DESCRIPTION] = b.replace(/\\n/g, '').trim();
        } else {
			flag.datatypeProperties[consts.CUSTOM.CONTENT_DESCRIPTION] = b.trim();
        }
    });
};