import { entityMaker, entityRefMaker, getRelation } from 'funktologies';
import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';

export function getElevation(cheerioElem: CheerioSelector, country: string, countryId: string) {
    const objectProperties = store.countries[countryId].objectProperties;
	let map = getRelation(objectProperties, consts.ONTOLOGY.HAS_ELEVATION);
	const eId = consts.ONTOLOGY.INST_ELEVATION + getUuid(country);
    let objectProp = {};
    let bailOut = true;
    cheerioElem('#field-elevation').each(() => {
        if (!map) {
            if (store.elevations[eId]) {
                objectProp[consts.ONTOLOGY.HAS_ELEVATION] = store.elevations[eId];
            } else {
                objectProp = entityMaker(
                    consts.ONTOLOGY.HAS_ELEVATION,
                    consts.ONTOLOGY.ONT_ELEVATION,
                    eId,
                    `Elevation for ${country}`);
                store.elevations[eId] = objectProp[consts.ONTOLOGY.HAS_ELEVATION];
            }
            map = objectProp[consts.ONTOLOGY.HAS_ELEVATION];
            store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_ELEVATION, objectProp));
        }
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
	cheerioElem('#field-elevation > div.category_data.subfield.numeric').each((index: number, element: CheerioElement) => {
		const elevation1Switch = cheerioElem(element).find('span.subfield-name').text().trim();
        const elevation1Data = cheerioElem(element).find('span.subfield-number').text().trim();
		switch (elevation1Switch) {
			case 'mean elevation:':
				map.datatypeProperties[consts.ONTOLOGY.DT_MEAN_ELEVATION] = Number(elevation1Data.replace(/[^0-9\-]/g, '').trim()) || null;
				break;
		}
    });
	cheerioElem('#field-elevation > div.category_data.subfield.text').each((index: number, element: CheerioElement) => {
		const elevation2Switch = cheerioElem(element).find('span.subfield-name').text().trim();
        const elevation2Data = cheerioElem(element).text().trim();
		switch (elevation2Switch) {
            case 'lowest point:':
                const removelowestPoint = 'lowest point:';
                const lowPointTxt = elevation2Data.substr(elevation2Data.indexOf(removelowestPoint) + removelowestPoint.length).trim();
                if (lowPointTxt === 'sea level') {
                    map.datatypeProperties[consts.ONTOLOGY.DT_LOWEST_POINT] = 0;
                    map.datatypeProperties[consts.ONTOLOGY.DT_LOWEST_POINT_DESCRIPTION] = 'sea level';
                    break;
                }
                map.datatypeProperties[consts.ONTOLOGY.DT_LOWEST_POINT] = Number(lowPointTxt.replace(/[^0-9\-]/g, '').trim()) || null;
                if (map.datatypeProperties[consts.ONTOLOGY.DT_LOWEST_POINT]) {
                    map.datatypeProperties[consts.ONTOLOGY.DT_LOWEST_POINT_DESCRIPTION] = lowPointTxt.substring(0, lowPointTxt.search(/[0-9\-]/g)).trim();
                }
				break;
			case 'highest point:':
                const removehighestPoint = 'highest point:';
                const highPointTxt = elevation2Data.substr(elevation2Data.indexOf(removehighestPoint) + removehighestPoint.length).trim();
                if (highPointTxt === 'sea level') {
                    map.datatypeProperties[consts.ONTOLOGY.DT_HIGHEST_POINT] = 0;
                    map.datatypeProperties[consts.ONTOLOGY.DT_HIGHEST_POINT_DESCRIPTION] = 'sea level';
                    break;
                }
                map.datatypeProperties[consts.ONTOLOGY.DT_HIGHEST_POINT] = Number(highPointTxt.replace(/[^0-9\-]/g, '').trim()) || null;
                if (map.datatypeProperties[consts.ONTOLOGY.DT_HIGHEST_POINT]) {
                    map.datatypeProperties[consts.ONTOLOGY.DT_HIGHEST_POINT_DESCRIPTION] = highPointTxt.substring(0, highPointTxt.search(/[0-9\-]/g)).trim();
                }
				break;
		}
    });
	map.datatypeProperties[consts.ONTOLOGY.DT_UNIT] = 'm';
};