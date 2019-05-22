import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';
import { getRelation } from '../utils/get-objectProperty';

export function getRegionMapImg(cheerioElem: CheerioSelector, country: string, countryId: string) {
    const objectProperties = store.countries[countryId].objectProperties;
    cheerioElem('div.mapBox').each((index: number, element: CheerioElement) => {
        let map = getRelation(objectProperties, consts.ONTOLOGY.HAS_REGION_MAP);
        const rmId = consts.ONTOLOGY.INST_REGION_MAP + getUuid(country);
        let objectProp = {};
        objectProp[consts.ONTOLOGY.HAS_REGION_MAP] = map;
        if (!map) {
            if (store.regionMaps[rmId]) {
                objectProp[consts.ONTOLOGY.HAS_REGION_MAP] = store.regionMaps[rmId];
            } else {
                objectProp = entityMaker(
                    consts.ONTOLOGY.HAS_REGION_MAP,
                    consts.ONTOLOGY.ONT_REGION_MAP,
                    rmId,
                    `Region Map for ${country}`);
            }
            map = objectProp[consts.ONTOLOGY.HAS_REGION_MAP];
        }
        const a = cheerioElem(element).find('img').attr('src');
        let regionMapImgUrl;
        if (a && a.replace('../', '')) {
            regionMapImgUrl = consts.BASE.URL_BASE + a.replace('../', '');
            if (regionMapImgUrl && !regionMapImgUrl.includes('locator-map')) {
                const datatypeProp = {};
                datatypeProp[consts.ONTOLOGY.DT_LOCATOR_URI] = regionMapImgUrl;
                map.datatypeProperties = datatypeProp;
                store.regionMaps[rmId] = map;
                store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_REGION_MAP, objectProp));
            }
        }
        // TODO: scrape physical image from url and store it.
    });
};