import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';
import { getRelation } from '../utils/get-objectProperty';

export function getBorderMapImg(cheerioElem: CheerioSelector, country: string, countryId: string): void {
    const objectProperties = store.countries[countryId].objectProperties;
    cheerioElem('div.locatorBox').each((index: number, element: CheerioElement) => {
        let map = getRelation(objectProperties, consts.ONTOLOGY.HAS_BORDER_MAP);
        const a = cheerioElem(element).find('img').attr('src');
        let borderMapUrl;
        let bmId;
        if (a && a.replace('../', '')) {
            const borderMapId = a.replace('../', '');
            borderMapUrl = consts.BASE.URL_BASE + a.replace('../', '');
            bmId = consts.ONTOLOGY.INST_BORDER_MAP + getUuid(borderMapId);
        }
        let objectProp = {};
        if (!map) {
            if (store.borderMaps[bmId]) {
                objectProp[consts.ONTOLOGY.HAS_BORDER_MAP] = store.borderMaps[bmId];
            } else {
                objectProp = entityMaker(
                    consts.ONTOLOGY.HAS_BORDER_MAP,
                    consts.ONTOLOGY.ONT_BORDER_MAP,
                    bmId,
                    `Border Map for ${country}`);
                store.borderMaps[bmId] = objectProp[consts.ONTOLOGY.HAS_BORDER_MAP];
            }
            map = objectProp[consts.ONTOLOGY.HAS_BORDER_MAP];
            store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_BORDER_MAP, objectProp));
        }
        if (borderMapUrl) {
			const datatypeProp = {};
			datatypeProp[consts.ONTOLOGY.DT_LOCATOR_URI] = borderMapUrl;
			map.datatypeProperties = datatypeProp;
        }
        // TODO: scrape physical image from url and store it.
    });
};