const MAIN_INSTANCE_PATH = 'http://williamrobertfunk.com/instance/';
const MAIN_ONT_PATH = 'http://williamrobertfunk.com/ontologies/world-factbook#';
const ASSET_ONT_PATH = 'http://www.daedafusion.com/Asset#';
const GEO_ONT_PATH = 'http://www.w3.org/2003/01/geo/wgs84_pos#';
const WGS84_POS = {
	LAT: GEO_ONT_PATH + 'lat',
	LONG: GEO_ONT_PATH + 'long',
	LAT_LONG: GEO_ONT_PATH + 'lat_long',
	LOCATION: GEO_ONT_PATH + 'location',
	SPATIAL_THING: GEO_ONT_PATH + 'SpatialThing',
	ALT: GEO_ONT_PATH + 'alt',
	POINT: GEO_ONT_PATH + 'Point'
};

const BASE = {
	COUNTRY_BLACKLIST: [
		"please select a country to view",
		"world"
	],
	DATA_REQUEST_TIMEOUT: 20000,
	URL_BASE: 'https://www.cia.gov/library/publications/the-world-factbook/'
};

const ONTOLOGY = {
	// Base path for all things ontology definition
	MAIN_ONT_PATH: MAIN_ONT_PATH,
	// Ontology class definition paths
	ONT_AGRICULTURAL_LAND: MAIN_ONT_PATH + 'AgriculturalLand/',
	ONT_ARABLE_LAND: MAIN_ONT_PATH + 'ArableLand/',
	ONT_ARTIFICIALLY_IRRIGATED_LAND: MAIN_ONT_PATH + 'ArtificiallyIrrigatedLand/',
	ONT_BORDER: MAIN_ONT_PATH + 'Border/',
	ONT_BORDER_COUNTRY: MAIN_ONT_PATH + 'BorderCountryPair/',
	ONT_BORDER_MAP: MAIN_ONT_PATH + 'BorderMap/',
	ONT_CLIMATE: MAIN_ONT_PATH + 'Climate/',
	ONT_CLIMATE_ZONE: MAIN_ONT_PATH + 'ClimateZone/',
	ONT_COAST: MAIN_ONT_PATH + 'Coast/',
	ONT_COUNTRY: MAIN_ONT_PATH + 'Country/',
	ONT_DOMAIN_AREA: MAIN_ONT_PATH + 'DomainArea/',
	ONT_ELEVATION: MAIN_ONT_PATH + 'Elevation/',
	ONT_FLAG: MAIN_ONT_PATH + 'NationalFlag/',
	ONT_FOREST_LAND: MAIN_ONT_PATH + 'ForestLand/',
	ONT_GEO_LOCATION: WGS84_POS.LOCATION,
	ONT_GEOGRAPHIC_NOTE: MAIN_ONT_PATH + 'GeographicNote/',
	ONT_IMAGE: MAIN_ONT_PATH + 'Image/',
	ONT_LAND_USE: MAIN_ONT_PATH + 'LandUse/',
	ONT_MARITIME_CLAIM: MAIN_ONT_PATH + 'MaritimeClaim/',
	ONT_NATURAL_HAZARD: MAIN_ONT_PATH + 'NaturalHazard/',
	ONT_NATURAL_RESOURCE: MAIN_ONT_PATH + 'NaturalResource/',
	ONT_OTHER_LAND: MAIN_ONT_PATH + 'OtherLand/',
	ONT_PERMANENT_CROPS_LAND: MAIN_ONT_PATH + 'PermanentCropsLand/',
	ONT_PERMANENT_PASTURE_LAND: MAIN_ONT_PATH + 'PermanentPastureLand/',
	ONT_REGION_MAP: MAIN_ONT_PATH + 'RegionMap/',
	ONT_TERRAIN: MAIN_ONT_PATH + 'Terrain/',
	// Ontology definition paths for (predicate) object/relation properties
	HAS_AGRICULTURAL_LAND: MAIN_ONT_PATH + 'hasAgriculturalLand/',
	HAS_ARABLE_LAND: MAIN_ONT_PATH + 'hasArableLand/',
	HAS_ARTIFICIALLY_IRRIGATED_LAND: MAIN_ONT_PATH + 'hasArtificiallyIrrigatedLand/',
	HAS_BORDER: MAIN_ONT_PATH + 'hasBorder/',
	HAS_BORDER_COUNTRY: MAIN_ONT_PATH + 'hasBorderCountryPair/',
	HAS_BORDER_MAP: MAIN_ONT_PATH + 'hasBorderMap/',
	HAS_CLIMATE: MAIN_ONT_PATH + 'hasClimate/',
	HAS_CLIMATE_ZONE: MAIN_ONT_PATH + 'hasClimateZone/',
	HAS_COAST: MAIN_ONT_PATH + 'hasCoast/',
	HAS_COUNTRY: MAIN_ONT_PATH + 'hasCountry/',
	HAS_DOMAIN_AREA: MAIN_ONT_PATH + 'hasDomainArea/',
	HAS_ELEVATION: MAIN_ONT_PATH + 'hasElevation/',
	HAS_FLAG: MAIN_ONT_PATH + 'hasNationalFlag/',
	HAS_FOREST_LAND: MAIN_ONT_PATH + 'hasForestLand/',
	HAS_GEOGRAPHIC_NOTE: MAIN_ONT_PATH + 'hasGeographicNote/',
	HAS_LAND_USE: MAIN_ONT_PATH + 'hasLandUse/',
	HAS_LOCATION: MAIN_ONT_PATH + 'hasLocation/',
	HAS_MARITIME_CLAIM: MAIN_ONT_PATH + 'hasMaritimeClaim/',
	HAS_NATURAL_RESOURCE: MAIN_ONT_PATH + 'hasNaturalResource/',
	HAS_NATURAL_HAZARD: MAIN_ONT_PATH + 'hasNaturalHazard/',
	HAS_OTHER_LAND: MAIN_ONT_PATH + 'hasOtherLand/',
	HAS_PERMANENT_CROPS_LAND: MAIN_ONT_PATH + 'hasPermanentCropsLand/',
	HAS_PERMANENT_PASTURE_LAND: MAIN_ONT_PATH + 'hasPermanentPastureLand/',
	HAS_REGION_MAP: MAIN_ONT_PATH + 'hasRegionMap/',
	HAS_SUPPLEMENTAL_IMG: MAIN_ONT_PATH + 'hasSupplementalImage/',
	HAS_TERRAIN: MAIN_ONT_PATH + 'hasTerrain/',
	// Base path for all things instance definition
	MAIN_INSTANCE_PATH: MAIN_INSTANCE_PATH,
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
	INST_GEO_LOCATION: GEO_ONT_PATH + 'Location/',
	INST_GEOGRAPHIC_NOTE: MAIN_INSTANCE_PATH + 'GeographicNote/',
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
	// Ontology definition paths for (predicate) datatype properties
	AREA_COMPARATIVE: MAIN_ONT_PATH + 'areaComparative/',
	AREA_RANK: MAIN_ONT_PATH + 'areaRank/',
	BACKGROUND: MAIN_ONT_PATH + 'background/',
	BORDER_LENGTH: MAIN_ONT_PATH + 'borderLength/',
	CLIMATE_ZONE_NAME: MAIN_ONT_PATH + 'climateZoneName/',
	CLIMATE_ZONE_DESCRIPTION: MAIN_ONT_PATH + 'climateZoneDescription/',
	CONTENT_DESCRIPTION: ASSET_ONT_PATH + 'contentDescription/',
	CONTIGUOUS_ZONE: MAIN_ONT_PATH + 'contiguousZone/',
	CONTINENTAL_SHELF: MAIN_ONT_PATH + 'continentalShelf/',
	CONTINENTAL_SHELF_MODIFIER: MAIN_ONT_PATH + 'continentalShelfModifier/',
	DESCRIPTION: MAIN_ONT_PATH + 'description/',
	EXCLUSIVE_ECONOMIC_ZONE: MAIN_ONT_PATH + 'exclusiveEconomicZone/',
	EXCLUSIVE_FISHING_ZONE: MAIN_ONT_PATH + 'exclusiveFishingZone/',
	HAZARD_DESCRIPTION: MAIN_ONT_PATH + 'hazardDescription/',
	HIGHEST_POINT: MAIN_ONT_PATH + 'highestPoint/',
	HIGHEST_POINT_DESCRIPTION: MAIN_ONT_PATH + 'highestPointDescription/',
	IMAGE_DIMENSIONS: MAIN_ONT_PATH + 'imageDimensions/',
	IMAGE_SIZE: MAIN_ONT_PATH + 'imageSize/',
	ISO_CODE: MAIN_ONT_PATH + 'countryCodeISO/',
	LAST_ESTIMATED: MAIN_ONT_PATH + 'lastEstimated/',
	LAND_AREA: MAIN_ONT_PATH + 'landArea/',
	LENGTH: MAIN_ONT_PATH + 'length/',
	LENGTH_MODIFIER: MAIN_ONT_PATH + 'lengthModifier/',
	LOCATION_DESCRIPTION: MAIN_ONT_PATH + 'locationDescription/',
	LOCATION_URI: MAIN_ONT_PATH + 'locatorURI/',
	LOWEST_POINT: MAIN_ONT_PATH + 'lowestPoint/',
	LOWEST_POINT_DESCRIPTION: MAIN_ONT_PATH + 'lowestPointDescription/',
	MAP_REFERENCES: MAIN_ONT_PATH + 'mapReferences/',
	MEAN_ELEVATION: MAIN_ONT_PATH + 'meanElevation/',
	PERCENTAGE: MAIN_ONT_PATH + 'percentage/',
	POPULATION_DISTRIBUTION: MAIN_ONT_PATH + 'populationDistribution/',
	RESOURCE_NAME: MAIN_ONT_PATH + 'resourceName/',
	SUPPLEMENTAL_EXPLANATION: MAIN_ONT_PATH + 'supplementalExplanation/',
	TERRITORIAL_SEA: MAIN_ONT_PATH + 'territorialSea/',
	TOTAL_AREA: MAIN_ONT_PATH + 'totalArea/',
	TOTAL_BORDER: MAIN_ONT_PATH + 'totalLandBorder/',
	TOTAL_BORDER_COUNTRIES: MAIN_ONT_PATH + 'totalBorderCountries/',
	UNIT: MAIN_ONT_PATH + 'unit/',
	WATER_AREA: MAIN_ONT_PATH + 'waterArea/'
};

const RDFS = {
	label: 'http://www.w3.org/2000/01/rdf-schema#label'
};
class Constants {
	BASE = BASE;
	ONTOLOGY = ONTOLOGY;
	RDFS = RDFS;
	WGS84_POS = WGS84_POS;
};

export const consts = new Constants();