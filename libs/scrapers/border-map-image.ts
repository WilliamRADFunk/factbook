import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getBorderMapImg(cheerioElem, country, countryId) {
    const objectProperties = store.countries[countryId].objectProperties;
    cheerioElem('div.locatorBox').each(function() {
        let map = getRelation(objectProperties, consts.CUSTOM.HAS_BORDER_MAP);
        const a = cheerioElem(this).find('img').attr('src');
        let borderMapUrl, bmId;
        if (a && a.replace('../', '')) {
            const borderMapId = a.replace('../', '');
            borderMapUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
            bmId = consts.CUSTOM.INST_BORDER_MAP + getUuid(borderMapId);
        }
        let objectProp = {};
        if (!map) {
            if (store.borderMaps[bmId]) {
                objectProp[consts.CUSTOM.HAS_BORDER_MAP] = store.borderMaps[bmId];
            } else {
                objectProp = entityMaker(
                    consts.CUSTOM.HAS_BORDER_MAP,
                    consts.CUSTOM.ONT_BORDER_MAP,
                    bmId,
                    `Border Map for ${country}`);
                store.borderMaps[bmId] = objectProp[consts.CUSTOM.HAS_BORDER_MAP];
            }
            map = objectProp[consts.CUSTOM.HAS_BORDER_MAP];
            store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_BORDER_MAP, objectProp));
        }
        if (borderMapUrl) {
			const datatypeProp = {};
			datatypeProp[consts.CUSTOM.LOCATION_URI] = borderMapUrl;
			objectProp[consts.CUSTOM.HAS_BORDER_MAP].datatypeProperties = datatypeProp;
        }
        // TODO: scrape physical image from url and store it.
    });
};