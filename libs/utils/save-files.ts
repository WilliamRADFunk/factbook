import { consts } from '../constants/constants';
import { saveFile } from './save-file';

export function saveFiles() {
	saveFile('countries', 'countries', consts.CUSTOM.ONT_COUNTRY);
	saveFile('border-countries', 'borderCountries', consts.CUSTOM.ONT_BORDER_COUNTRY);
	saveFile('border-maps', 'borderMaps', consts.CUSTOM.ONT_BORDER_MAP);
	saveFile('climates', 'climates', consts.CUSTOM.ONT_CLIMATE);
	saveFile('climates-zones', 'climateZones', consts.CUSTOM.ONT_CLIMATE_ZONE);
	saveFile('coasts', 'coasts', consts.CUSTOM.ONT_COAST);
	saveFile('domain-areas', 'domainAreas', consts.CUSTOM.ONT_DOMAIN_AREA);
	saveFile('images', 'images', consts.CUSTOM.ONT_IMAGE);
	saveFile('locations', 'locations', consts.CUSTOM.ONT_GEO_LOCATION);
	saveFile('national-flags', 'nationalFlags', consts.CUSTOM.ONT_FLAG);
	saveFile('region-maps', 'regionMaps', consts.CUSTOM.ONT_REGION_MAP);
	saveFile('borders', 'borders', consts.CUSTOM.ONT_BORDER);
	saveFile('maritime-claims', 'maritimeClaims', consts.CUSTOM.ONT_MARITIME_CLAIM);
	saveFile('natural-resources', 'naturalResources', consts.CUSTOM.ONT_NATURAL_RESOURCE);
	saveFile('elevations', 'elevations', consts.CUSTOM.ONT_ELEVATION);
	saveFile('terrains', 'terrains', consts.CUSTOM.ONT_TERRAIN);
};