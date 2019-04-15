import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

function parseSingleCoordinates(cheerio: Cheerio, country: string, countryId: string) {
	const geoId = consts.ONTOLOGY.INST_GEO_LOCATION + getUuid(country);
    const locations = store.countries[countryId].objectProperties
        .filter(objProp => objProp[consts.ONTOLOGY.HAS_LOCATION]);
    let geoAttr = locations.find(loc => loc && loc[consts.ONTOLOGY.HAS_LOCATION]['@id'] === geoId)[consts.ONTOLOGY.HAS_LOCATION];
    const content = cheerio.find('div.category_data.subfield.text').text().trim();
	
	let objectProp = {};
	if (!geoAttr) {
		if (store.locations[geoId]) {
			objectProp[consts.ONTOLOGY.HAS_LOCATION] = store.locations[geoId];
		} else {
			objectProp = entityMaker(
				consts.ONTOLOGY.HAS_LOCATION,
				consts.ONTOLOGY.ONT_GEO_LOCATION,
				geoId,
				`Geographic Location for ${country}`);
			store.locations[geoId] = objectProp[consts.ONTOLOGY.HAS_LOCATION];
		}
		geoAttr = objectProp[consts.ONTOLOGY.HAS_LOCATION];
		store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_LOCATION, objectProp));
    } else {
        geoAttr = store.locations[geoId];
    }

	if (content) {
		let coords = content.split(',');
		let latSplit = coords[0].trim().split(' ');
		let lat = (latSplit[latSplit.length - 1].includes('S') ? -1 : 1) * Number(latSplit[0].trim() + '.' + latSplit[1].trim());
		let lngSplit = coords[1].trim().split(' ');
		let lng = (lngSplit[lngSplit.length - 1].includes('W') ? -1 : 1) * Number(lngSplit[0].trim() + '.' + lngSplit[1].trim());
		
		let datatypeProp = {};
		if (geoAttr.datatypeProperties) {
            geoAttr.datatypeProperties[consts.WGS84_POS.LAT] = lat;
            geoAttr.datatypeProperties[consts.WGS84_POS.LONG] = lng;
            geoAttr.datatypeProperties[consts.WGS84_POS.LAT_LONG] = `${lat}, ${lng}`;
		} else {
            datatypeProp[consts.WGS84_POS.LAT] = lat;
            datatypeProp[consts.WGS84_POS.LONG] = lng;
            datatypeProp[consts.WGS84_POS.LAT_LONG] = `${lat}, ${lng}`;
            geoAttr.datatypeProperties = datatypeProp;
        }
    }
}

function parseMultipleCoordinates(cheerioElem: CheerioSelector, country: string, countryId: string, scope) {
	cheerioElem(scope).find('p').each(function() {
        const content = cheerioElem(this).text().trim().split(':')[1];
		const strongTag = cheerioElem(this).find('strong').text().trim().slice(0, -1);
		const locations = store.countries[countryId].objectProperties
            .filter(objProp => objProp[consts.ONTOLOGY.HAS_LOCATION])
            .map(objProp => objProp[consts.ONTOLOGY.HAS_LOCATION]);
        let objectProp = {};

        if (strongTag) {
		    let geoId = consts.ONTOLOGY.INST_GEO_LOCATION + getUuid(country) + getUuid(strongTag);
            let geoAttr = locations.find(loc => loc && loc['@id'] === geoId);
            if (!geoAttr) {
                if (store.locations[geoId]) {
                    objectProp[consts.ONTOLOGY.HAS_LOCATION] = store.locations[geoId];
                } else {
                    objectProp = entityMaker(
                        consts.ONTOLOGY.HAS_LOCATION,
                        consts.ONTOLOGY.ONT_GEO_LOCATION,
                        geoId,
                        `Geographic Location for ${country} - ${strongTag}`);
                    store.locations[geoId] = objectProp[consts.ONTOLOGY.HAS_LOCATION];
                }
                geoAttr = objectProp[consts.ONTOLOGY.HAS_LOCATION];
                store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_LOCATION, objectProp));
            } else {
                geoAttr = store.locations[geoId];
            }

            if (content) {
                let coords = content.split(',');
                let latSplit = coords[0].trim().split(' ');
                let lat = (latSplit[latSplit.length - 1].includes('S') ? -1 : 1) * Number(latSplit[0].trim() + '.' + latSplit[1].trim());
                let lngSplit = coords[1].trim().split(' ');
                let lng = (lngSplit[lngSplit.length - 1].includes('W') ? -1 : 1) * Number(lngSplit[0].trim() + '.' + lngSplit[1].trim());
                
                let datatypeProp = {};
                if (geoAttr && geoAttr.datatypeProperties) {
                    geoAttr.datatypeProperties[consts.WGS84_POS.LAT] = lat;
                    geoAttr.datatypeProperties[consts.WGS84_POS.LONG] = lng;
                    geoAttr.datatypeProperties[consts.WGS84_POS.LAT_LONG] = `${lat}, ${lng}`;
                } else {
                    datatypeProp[consts.WGS84_POS.LAT] = lat;
                    datatypeProp[consts.WGS84_POS.LONG] = lng;
                    datatypeProp[consts.WGS84_POS.LAT_LONG] = `${lat}, ${lng}`;
                    geoAttr.datatypeProperties = datatypeProp;
                }
            }
        }
	});
}

export function getGeographyCoordinates(cheerioElem: CheerioSelector, country: string, countryId: string) {
	cheerioElem('#field-geographic-coordinates').each(function() {
		const hasMultLocations = cheerioElem(this).find('div.category_data.subfield.text > p');
		// Multiple p tags suggests the nation has multiple locations in different parts of the world.
		// This means distinct description and geographic coordinates. Each must be handled separately.
        if (hasMultLocations.length) {
			parseMultipleCoordinates(cheerioElem, country, countryId, this);
		} else {
			parseSingleCoordinates(cheerioElem(this), country, countryId);
        }
        return;
    });
};