const MAIN_INSTANCE_PATH = 'http://williamrobertfunk.com/instance/';
const MAIN_ONT_PATH = 'http://williamrobertfunk.com/ontologies/world-factbook#';
const ASSET_ONT_PATH = 'http://www.daedafusion.com/Asset#';
const GEO_ONT_PATH = 'http://www.w3.org/2003/01/geo/wgs84_pos#';
const WGS84_POS = {
	ALT: GEO_ONT_PATH + 'alt',
	LAT: GEO_ONT_PATH + 'lat',
	LAT_LONG: GEO_ONT_PATH + 'lat_long',
	LOCATION: GEO_ONT_PATH + 'location',
	LONG: GEO_ONT_PATH + 'long',
	POINT: GEO_ONT_PATH + 'Point',
	SPATIAL_THING: GEO_ONT_PATH + 'SpatialThing'
};

const BASE = {
	COUNTRY_BLACKLIST: [
		"please select a country to view",
		"world"
	],
	DATA_REQUEST_TIMEOUT: 40000,
	URL_BASE: 'https://www.cia.gov/library/publications/the-world-factbook/',
	URL_COUNTRY_BASE: 'https://www.cia.gov/library/publications/the-world-factbook/geos/'
};

const ONTOLOGY = {
	// Ontology definition paths for (predicate) datatype properties
	DT_AREA_COMPARATIVE: MAIN_ONT_PATH + 'areaComparative',
	DT_AREA_RANK: MAIN_ONT_PATH + 'areaRank',
	DT_BACKGROUND: MAIN_ONT_PATH + 'background',
	DT_BORDER_LENGTH: MAIN_ONT_PATH + 'borderLength',
	DT_CLIMATE_ZONE_DESCRIPTION: MAIN_ONT_PATH + 'climateZoneDescription',
	DT_CLIMATE_ZONE_NAME: MAIN_ONT_PATH + 'climateZoneName',
	DT_COLLECTION_TIMESTAMP: ASSET_ONT_PATH + 'collectionTimestamp',
	DT_CONTENTS: MAIN_ONT_PATH + 'contents',
	DT_CONTENT_DESCRIPTION: MAIN_ONT_PATH + 'contentDescription',
	DT_CONTIGUOUS_ZONE: MAIN_ONT_PATH + 'contiguousZone',
	DT_CONTINENTAL_SHELF: MAIN_ONT_PATH + 'continentalShelf',
	DT_CONTINENTAL_SHELF_MODIFIER: MAIN_ONT_PATH + 'continentalShelfModifier',
	DT_DESCRIPTION: MAIN_ONT_PATH + 'description',
	DT_EXCLUSIVE_ECONOMIC_ZONE: MAIN_ONT_PATH + 'exclusiveEconomicZone',
	DT_EXCLUSIVE_FISHING_ZONE: MAIN_ONT_PATH + 'exclusiveFishingZone',
	DT_HAZARD_DESCRIPTION: MAIN_ONT_PATH + 'hazardDescription',
	DT_HIGHEST_POINT: MAIN_ONT_PATH + 'highestPoint',
	DT_HIGHEST_POINT_DESCRIPTION: MAIN_ONT_PATH + 'highestPointDescription',
	DT_IMAGE_DIMENSIONS: MAIN_ONT_PATH + 'imageDimensions',
	DT_IMAGE_SIZE: MAIN_ONT_PATH + 'imageSize',
	DT_ISO_CODE: MAIN_ONT_PATH + 'countryCodeISO',
	DT_LAND_AREA: MAIN_ONT_PATH + 'landArea',
	DT_LAST_ESTIMATED: MAIN_ONT_PATH + 'lastEstimated',
	DT_LENGTH: MAIN_ONT_PATH + 'length',
	DT_LENGTH_MODIFIER: MAIN_ONT_PATH + 'lengthModifier',
	DT_LOCATION_DESCRIPTION: MAIN_ONT_PATH + 'locationDescription',
	DT_LOCATION_REF_DESCRIPTION: MAIN_ONT_PATH + 'locationReferenceDescription',
	DT_LOCATOR_URI: MAIN_ONT_PATH + 'locatorURI',
	DT_LOWEST_POINT: MAIN_ONT_PATH + 'lowestPoint',
	DT_LOWEST_POINT_DESCRIPTION: MAIN_ONT_PATH + 'lowestPointDescription',
	DT_MAP_REFERENCES: MAIN_ONT_PATH + 'mapReferences',
	DT_MEAN_ELEVATION: MAIN_ONT_PATH + 'meanElevation',
	DT_MIME_TYPE: ASSET_ONT_PATH + 'mimeType',
	DT_PERCENTAGE: MAIN_ONT_PATH + 'percentage',
	DT_POPULATION_DISTRIBUTION: MAIN_ONT_PATH + 'populationDistribution',
	DT_RESOURCE_NAME: MAIN_ONT_PATH + 'resourceName',
	DT_SUPPLEMENTAL_EXPLANATION: MAIN_ONT_PATH + 'supplementalExplanation',
	DT_TERRITORIAL_SEA: MAIN_ONT_PATH + 'territorialSea',
	DT_TOTAL_AREA: MAIN_ONT_PATH + 'totalArea',
	DT_TOTAL_BORDER: MAIN_ONT_PATH + 'totalLandBorder',
	DT_TOTAL_BORDER_COUNTRIES: MAIN_ONT_PATH + 'totalBorderCountries',
	DT_UNIT: MAIN_ONT_PATH + 'unit',
	DT_WATER_AREA: MAIN_ONT_PATH + 'waterArea',
	// Ontology definition paths for (predicate) object/relation properties
	HAS_AGRICULTURAL_LAND: MAIN_ONT_PATH + 'hasAgriculturalLand',
	HAS_ARABLE_LAND: MAIN_ONT_PATH + 'hasArableLand',
	HAS_ARTIFICIALLY_IRRIGATED_LAND: MAIN_ONT_PATH + 'hasArtificiallyIrrigatedLand',
	HAS_BORDER: MAIN_ONT_PATH + 'hasBorder',
	HAS_BORDER_COUNTRY: MAIN_ONT_PATH + 'hasBorderCountryPair',
	HAS_BORDER_MAP: MAIN_ONT_PATH + 'hasBorderMap',
	HAS_CLIMATE: MAIN_ONT_PATH + 'hasClimate',
	HAS_CLIMATE_ZONE: MAIN_ONT_PATH + 'hasClimateZone',
	HAS_COAST: MAIN_ONT_PATH + 'hasCoast',
	HAS_COUNTRY: MAIN_ONT_PATH + 'hasCountry',
	HAS_DOMAIN_AREA: MAIN_ONT_PATH + 'hasDomainArea',
	HAS_ELEVATION: MAIN_ONT_PATH + 'hasElevation',
	HAS_FLAG: MAIN_ONT_PATH + 'hasNationalFlag',
	HAS_FOREST_LAND: MAIN_ONT_PATH + 'hasForestLand',
	HAS_GEOGRAPHIC_NOTE: MAIN_ONT_PATH + 'hasGeographicNote',
	HAS_LAND_USE: MAIN_ONT_PATH + 'hasLandUse',
	HAS_LOCATION: MAIN_ONT_PATH + 'hasLocation',
	HAS_MARITIME_CLAIM: MAIN_ONT_PATH + 'hasMaritimeClaim',
	HAS_NATURAL_HAZARD: MAIN_ONT_PATH + 'hasNaturalHazard',
	HAS_NATURAL_RESOURCE: MAIN_ONT_PATH + 'hasNaturalResource',
	HAS_OTHER_LAND: MAIN_ONT_PATH + 'hasOtherLand',
	HAS_PERMANENT_CROPS_LAND: MAIN_ONT_PATH + 'hasPermanentCropsLand',
	HAS_PERMANENT_PASTURE_LAND: MAIN_ONT_PATH + 'hasPermanentPastureLand',
	HAS_REGION_MAP: MAIN_ONT_PATH + 'hasRegionMap',
	HAS_SUPPLEMENTAL_IMG: MAIN_ONT_PATH + 'hasSupplementalImage',
	HAS_TERRAIN: MAIN_ONT_PATH + 'hasTerrain',
	// Instance definition paths
	INST_AGRICULTURAL_LAND: MAIN_INSTANCE_PATH + 'AgriculturalLand/',
	INST_ARABLE_LAND: MAIN_INSTANCE_PATH + 'ArableLand/',
	INST_ARTIFICIALLY_IRRIGATED_LAND: MAIN_INSTANCE_PATH + 'ArtificiallyIrrigatedLand/',
	INST_BORDER: MAIN_INSTANCE_PATH + 'Border/',
	INST_BORDER_COUNTRY: MAIN_INSTANCE_PATH + 'BorderCountryPair/',
	INST_BORDER_MAP: MAIN_INSTANCE_PATH + 'BorderMap/',
	INST_CLIMATE: MAIN_INSTANCE_PATH + 'Climate/',
	INST_CLIMATE_ZONE: MAIN_INSTANCE_PATH + 'ClimateZone/',
	INST_COAST: MAIN_INSTANCE_PATH + 'Coast/',
	INST_COUNTRY: MAIN_INSTANCE_PATH + 'Country/',
	INST_DOMAIN_AREA: MAIN_INSTANCE_PATH + 'DomainArea/',
	INST_ELEVATION: MAIN_INSTANCE_PATH + 'Elevation/',
	INST_FLAG: MAIN_INSTANCE_PATH + 'NationalFlag/',
	INST_FOREST_LAND: MAIN_INSTANCE_PATH + 'ForestLand/',
	INST_GEOGRAPHIC_NOTE: MAIN_INSTANCE_PATH + 'GeographicNote/',
	INST_GEO_LOCATION: MAIN_INSTANCE_PATH + 'Location/',
	INST_IMAGE: MAIN_INSTANCE_PATH + 'Image/',
	INST_LAND_USE: MAIN_INSTANCE_PATH + 'LandUse/',
	INST_MARITIME_CLAIM: MAIN_INSTANCE_PATH + 'MaritimeClaim/',
	INST_NATURAL_HAZARD: MAIN_INSTANCE_PATH + 'NaturalHazard/',
	INST_NATURAL_RESOURCE: MAIN_INSTANCE_PATH + 'NaturalResource/',
	INST_OTHER_LAND: MAIN_INSTANCE_PATH + 'OtherLand/',
	INST_PERMANENT_CROPS_LAND: MAIN_INSTANCE_PATH + 'PermanentCropsLand/',
	INST_PERMANENT_PASTURE_LAND: MAIN_INSTANCE_PATH + 'PermanentPastureLand/',
	INST_REGION_MAP: MAIN_INSTANCE_PATH + 'RegionMap/',
	INST_TERRAIN: MAIN_INSTANCE_PATH + 'Terrain/',
	// Base path for all things instance definition
	MAIN_INSTANCE_PATH,
	// Base path for all things ontology definition
	MAIN_ONT_PATH,
	// Ontology class definition paths
	ONT_AGRICULTURAL_LAND: MAIN_ONT_PATH + 'AgriculturalLand',
	ONT_ARABLE_LAND: MAIN_ONT_PATH + 'ArableLand',
	ONT_ARTIFICIALLY_IRRIGATED_LAND: MAIN_ONT_PATH + 'ArtificiallyIrrigatedLand',
	ONT_BORDER: MAIN_ONT_PATH + 'Border',
	ONT_BORDER_COUNTRY: MAIN_ONT_PATH + 'BorderCountryPair',
	ONT_BORDER_MAP: MAIN_ONT_PATH + 'BorderMap',
	ONT_CLIMATE: MAIN_ONT_PATH + 'Climate',
	ONT_CLIMATE_ZONE: MAIN_ONT_PATH + 'ClimateZone',
	ONT_COAST: MAIN_ONT_PATH + 'Coast',
	ONT_COUNTRY: MAIN_ONT_PATH + 'Country',
	ONT_DOMAIN_AREA: MAIN_ONT_PATH + 'DomainArea',
	ONT_ELEVATION: MAIN_ONT_PATH + 'Elevation',
	ONT_FLAG: MAIN_ONT_PATH + 'NationalFlag',
	ONT_FOREST_LAND: MAIN_ONT_PATH + 'ForestLand',
	ONT_GEOGRAPHIC_NOTE: MAIN_ONT_PATH + 'GeographicNote',
	ONT_GEO_LOCATION: MAIN_ONT_PATH + 'Location',
	ONT_IMAGE: MAIN_ONT_PATH + 'Image',
	ONT_LAND_USE: MAIN_ONT_PATH + 'LandUse',
	ONT_MARITIME_CLAIM: MAIN_ONT_PATH + 'MaritimeClaim',
	ONT_NATURAL_HAZARD: MAIN_ONT_PATH + 'NaturalHazard',
	ONT_NATURAL_RESOURCE: MAIN_ONT_PATH + 'NaturalResource',
	ONT_OTHER_LAND: MAIN_ONT_PATH + 'OtherLand',
	ONT_PERMANENT_CROPS_LAND: MAIN_ONT_PATH + 'PermanentCropsLand',
	ONT_PERMANENT_PASTURE_LAND: MAIN_ONT_PATH + 'PermanentPastureLand',
	ONT_REGION_MAP: MAIN_ONT_PATH + 'RegionMap',
	ONT_TERRAIN: MAIN_ONT_PATH + 'Terrain'
};

const RDFS = {
	label: 'http://www.w3.org/2000/01/rdf-schema#label'
};
class Constants {
	public BASE = BASE;
	public ONTOLOGY = ONTOLOGY;
	public RDFS = RDFS;
	public WGS84_POS = WGS84_POS;
};

export const consts = new Constants();