import { consts } from '../constants/constants';
import { saveFile } from './save-file';

export function saveFiles() {
	saveFile('countries', 'countries', consts.ONTOLOGY.ONT_COUNTRY);
	saveFile('border-countries', 'borderCountries', consts.ONTOLOGY.ONT_BORDER_COUNTRY);
	saveFile('border-maps', 'borderMaps', consts.ONTOLOGY.ONT_BORDER_MAP);
	saveFile('climates', 'climates', consts.ONTOLOGY.ONT_CLIMATE);
	saveFile('climates-zones', 'climateZones', consts.ONTOLOGY.ONT_CLIMATE_ZONE);
	saveFile('coasts', 'coasts', consts.ONTOLOGY.ONT_COAST);
	saveFile('domain-areas', 'domainAreas', consts.ONTOLOGY.ONT_DOMAIN_AREA);
	saveFile('images', 'images', consts.ONTOLOGY.ONT_IMAGE);
	saveFile('locations', 'locations', consts.ONTOLOGY.ONT_GEO_LOCATION);
	saveFile('national-flags', 'nationalFlags', consts.ONTOLOGY.ONT_FLAG);
	saveFile('region-maps', 'regionMaps', consts.ONTOLOGY.ONT_REGION_MAP);
	saveFile('borders', 'borders', consts.ONTOLOGY.ONT_BORDER);
	saveFile('maritime-claims', 'maritimeClaims', consts.ONTOLOGY.ONT_MARITIME_CLAIM);
	saveFile('natural-resources', 'naturalResources', consts.ONTOLOGY.ONT_NATURAL_RESOURCE);
	saveFile('elevations', 'elevations', consts.ONTOLOGY.ONT_ELEVATION);
	saveFile('terrains', 'terrains', consts.ONTOLOGY.ONT_TERRAIN);
};