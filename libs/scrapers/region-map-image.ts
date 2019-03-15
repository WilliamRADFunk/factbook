import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { getRelation } from '../utils/get-objectProperty';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getRegionMapImg(cheerioElem, country, countryId) {
    const objectProperties = store.countries[countryId].objectProperties;
    cheerioElem('div.mapBox').each(function() {
        let map = getRelation(objectProperties, consts.CUSTOM.HAS_REGION_MAP);
        const rmId = consts.CUSTOM.INST_REGION_MAP + getUuid(country);
        let objectProp = {};
        if (!map) {
            if (store.regionMaps[rmId]) {
                objectProp[consts.CUSTOM.HAS_REGION_MAP] = store.regionMaps[rmId];
            } else {
                objectProp = entityMaker(
                    consts.CUSTOM.HAS_REGION_MAP,
                    consts.CUSTOM.ONT_REGION_MAP,
                    rmId,
                    'Region Map');
            }
        }
        const a = cheerioElem(this).find('img').attr('src');
        let regionMapImgUrl;
        if (a && a.replace('../', '')) {
            regionMapImgUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
            if (regionMapImgUrl.includes('locator-map')) { }
            if (regionMapImgUrl && !regionMapImgUrl.includes('locator-map')) {
                const datatypeProp = {};
                datatypeProp[consts.CUSTOM.LOCATION_URI] = regionMapImgUrl;
                objectProp[consts.CUSTOM.HAS_REGION_MAP].datatypeProperties = datatypeProp;
                store.regionMaps[rmId] = objectProp[consts.CUSTOM.HAS_REGION_MAP];
                store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_REGION_MAP, objectProp));
            }
        }
        // TODO: scrape physical image from url and store it.
    });
};