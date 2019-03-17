import { consts } from '../constants/constants';
import { saveFile } from './save-file';

export function saveFiles() {
	saveFile('agricultural-lands', 'agriculturalLands', consts.ONTOLOGY.ONT_AGRICULTURAL_LAND);
	saveFile('arable-lands', 'arableLands', consts.ONTOLOGY.ONT_ARABLE_LAND);
	saveFile('artificially-irrigated-lands', 'artificiallyIrrigatedLands', consts.ONTOLOGY.ONT_ARTIFICIALLY_IRRIGATED_LAND);
	saveFile('border-countries', 'borderCountries', consts.ONTOLOGY.ONT_BORDER_COUNTRY);
	saveFile('border-maps', 'borderMaps', consts.ONTOLOGY.ONT_BORDER_MAP);
	saveFile('borders', 'borders', consts.ONTOLOGY.ONT_BORDER);
	saveFile('climates', 'climates', consts.ONTOLOGY.ONT_CLIMATE);
	saveFile('climates-zones', 'climateZones', consts.ONTOLOGY.ONT_CLIMATE_ZONE);
	saveFile('coasts', 'coasts', consts.ONTOLOGY.ONT_COAST);
	saveFile('countries', 'countries', consts.ONTOLOGY.ONT_COUNTRY);
	saveFile('domain-areas', 'domainAreas', consts.ONTOLOGY.ONT_DOMAIN_AREA);
	saveFile('elevations', 'elevations', consts.ONTOLOGY.ONT_ELEVATION);
	saveFile('forest-lands', 'forestLands', consts.ONTOLOGY.ONT_FOREST_LAND);
	saveFile('images', 'images', consts.ONTOLOGY.ONT_IMAGE);
	saveFile('land-uses', 'landUses', consts.ONTOLOGY.ONT_LAND_USE);
	saveFile('locations', 'locations', consts.ONTOLOGY.ONT_GEO_LOCATION);
	saveFile('maritime-claims', 'maritimeClaims', consts.ONTOLOGY.ONT_MARITIME_CLAIM);
	saveFile('national-flags', 'nationalFlags', consts.ONTOLOGY.ONT_FLAG);
	saveFile('natural-resources', 'naturalResources', consts.ONTOLOGY.ONT_NATURAL_RESOURCE);
	saveFile('other-lands', 'otherLands', consts.ONTOLOGY.ONT_OTHER_LAND);
	saveFile('permanent-crops-lands', 'permanentCropsLands', consts.ONTOLOGY.ONT_PERMANENT_CROPS_LAND);
	saveFile('permanent-pasture-lands', 'permanentPastureLands', consts.ONTOLOGY.ONT_PERMANENT_PASTURE_LAND);
	saveFile('region-maps', 'regionMaps', consts.ONTOLOGY.ONT_REGION_MAP);
	saveFile('terrains', 'terrains', consts.ONTOLOGY.ONT_TERRAIN);
};