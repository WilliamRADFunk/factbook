import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

function parseSingleLocation(cheerio: Cheerio, country: string, countryId: string) {
	const content = cheerio.find('div.category_data.subfield.text').text().trim();
	store.countries[countryId].datatypeProperties[consts.ONTOLOGY.LOCATION_REF_DESCRIPTION] = content;
	
	let geoId = consts.ONTOLOGY.INST_GEO_LOCATION + getUuid(country);
	let objectProp = {};
	if (store.locations[geoId]) {
		objectProp[consts.ONTOLOGY.HAS_LOCATION] = store.locations[geoId];
	} else {
		objectProp = entityMaker(
			consts.ONTOLOGY.HAS_LOCATION,
			consts.ONTOLOGY.ONT_GEO_LOCATION,
			geoId,
			`Geographic Location for ${country}`);
		store.locations[geoId] = objectProp[consts.ONTOLOGY.HAS_LOCATION];

		const datatypeProp = {};
		datatypeProp[consts.ONTOLOGY.LOCATION_DESCRIPTION] = content
		objectProp[consts.ONTOLOGY.HAS_LOCATION].datatypeProperties = datatypeProp;
	}
	store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_LOCATION, objectProp));
}

function parseMultipleLocations(cheerioElem: CheerioSelector, country: string, countryId: string, scope) {
	cheerioElem(scope).find('p').each(function() {
		const content = cheerioElem(this).text().trim();
		const strongTag = cheerioElem(this).find('strong').text().trim().slice(0, -1);
		const locations = store.countries[countryId].objectProperties
			.filter(objProp => objProp[consts.ONTOLOGY.HAS_LOCATION])
			.map(objProp => objProp[consts.ONTOLOGY.HAS_LOCATION]);
        let objectProp = {};
		if (!strongTag) {
			const description = content.substring(0, content.indexOf(strongTag)).trim();
			store.countries[countryId].datatypeProperties[consts.ONTOLOGY.LOCATION_REF_DESCRIPTION] = description;
		} else {
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

					const datatypeProp = {};
					datatypeProp[consts.ONTOLOGY.LOCATION_DESCRIPTION] = content
					objectProp[consts.ONTOLOGY.HAS_LOCATION].datatypeProperties = datatypeProp;
				}
				geoAttr = objectProp[consts.ONTOLOGY.HAS_LOCATION];
				store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_LOCATION, objectProp));
			}
		}
	});
}

export function getGeography(cheerioElem: CheerioSelector, country: string, countryId: string) {
	cheerioElem('#field-location').each(function() {
		const hasMultLocations = cheerioElem(this).find('div.category_data.subfield.text > p');
		// Multiple p tags suggests the nation has multiple locations in different parts of the world.
		// This means distinct description and geographic coordinates. Each must be handled separately.
        if (hasMultLocations.length) {
			parseMultipleLocations(cheerioElem, country, countryId, this);
        } else {
			parseSingleLocation(cheerioElem(this), country, countryId);
		}
	});
	cheerioElem('#field-map-references').each(function() {
        const mapRef = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (mapRef) {
            store.countries[countryId].datatypeProperties[consts.ONTOLOGY.MAP_REFERENCES] = mapRef;
        }
	});
};