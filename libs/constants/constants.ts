const URL_BASE = 'https://www.cia.gov/library/publications/the-world-factbook/';
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
const DATA_REQUEST_TIMEOUT = 20000;
const COUNTRY_BLACKLIST = [
	"please select a country to view",
	"world"
];

// Class Paths
const ONT_COUNTRY = MAIN_ONT_PATH + 'Country/';
const ONT_FLAG = MAIN_ONT_PATH + 'NationalFlag/';
const ONT_BORDER = MAIN_ONT_PATH + 'Border/';
const ONT_BORDER_COUNTRY = MAIN_ONT_PATH + 'BorderCountryPair/';
const ONT_BORDER_MAP = MAIN_ONT_PATH + 'BorderMap/';
const ONT_IMAGE = MAIN_ONT_PATH + 'Image/';
const ONT_GEO_LOCATION = WGS84_POS.LOCATION;
const ONT_REGION_MAP = MAIN_ONT_PATH + 'RegionMap/';
const ONT_DOMAIN_AREA = MAIN_ONT_PATH + 'DomainArea/';
const ONT_COAST = MAIN_ONT_PATH + 'Coast/';
const ONT_CLIMATE = MAIN_ONT_PATH + 'Climate/';
const ONT_CLIMATE_ZONE = MAIN_ONT_PATH + 'ClimateZone/';
const ONT_MARITIME_CLAIM = MAIN_ONT_PATH + 'MaritimeClaim/';
const ONT_NATURAL_RESOURCE = MAIN_ONT_PATH + 'NaturalResource/';
const ONT_ELEVATION = MAIN_ONT_PATH + 'Elevation/';
const ONT_TERRAIN = MAIN_ONT_PATH + 'Terrain/';

// ObjectProperty Paths
const HAS_BORDER = MAIN_ONT_PATH + 'hasBorder/';
const HAS_BORDER_COUNTRY = MAIN_ONT_PATH + 'hasBorderCountryPair/';
const HAS_BORDER_MAP = MAIN_ONT_PATH + 'hasBorderMap/';
const HAS_COUNTRY = MAIN_ONT_PATH + 'hasCountry/';
const HAS_FLAG = MAIN_ONT_PATH + 'hasNationalFlag/';
const HAS_LOCATION = MAIN_ONT_PATH + 'hasLocation/';
const HAS_REGION_MAP = MAIN_ONT_PATH + 'hasRegionMap/';
const HAS_SUPPLEMENTAL_IMG = MAIN_ONT_PATH + 'hasSupplementalImage/';
const HAS_DOMAIN_AREA = MAIN_ONT_PATH + 'hasDomainArea/';
const HAS_COAST = MAIN_ONT_PATH + 'hasCoast/';
const HAS_CLIMATE = MAIN_ONT_PATH + 'hasClimate/';
const HAS_CLIMATE_ZONE = MAIN_ONT_PATH + 'hasClimateZone/';
const HAS_MARITIME_CLAIM = MAIN_ONT_PATH + 'hasMaritimeClaim/';
const HAS_NATURAL_RESOURCE = MAIN_ONT_PATH + 'hasNaturalResource/';
const HAS_ELEVATION = MAIN_ONT_PATH + 'hasElevation/';
const HAS_TERRAIN = MAIN_ONT_PATH + 'hasTerrain/';

// DatatypeProperty Paths
const ISO_CODE = MAIN_ONT_PATH + 'countryCodeISO/';
const BACKGROUND = MAIN_ONT_PATH + 'background/';
const TOTAL_BORDER_COUNTRIES = MAIN_ONT_PATH + 'totalBorderCountries/';
const TOTAL_BORDER = MAIN_ONT_PATH + 'totalLandBorder/';
const BORDER_LENGTH = MAIN_ONT_PATH + 'borderLength/';
const LOCATION_DESCRIPTION = MAIN_ONT_PATH + 'locationDescription/';
const IMAGE_DIMENSIONS = MAIN_ONT_PATH + 'imageDimensions/';
const IMAGE_SIZE = MAIN_ONT_PATH + 'imageSize/';
const MAP_REFERENCES = MAIN_ONT_PATH + 'mapReferences/';
const DESCRIPTION = MAIN_ONT_PATH + 'description/';
const LOCATION_URI = MAIN_ONT_PATH + 'locatorURI/';
const CONTENT_DESCRIPTION = ASSET_ONT_PATH + 'contentDescription/';
const ONT_TOTAL_AREA = MAIN_ONT_PATH + 'totalArea/';
const ONT_LAND_AREA = MAIN_ONT_PATH + 'landArea/';
const ONT_WATER_AREA = MAIN_ONT_PATH + 'waterArea/';
const ONT_AREA_COMPARATIVE = MAIN_ONT_PATH + 'areaComparative/';
const ONT_AREA_RANK = MAIN_ONT_PATH + 'areaRank/';
const ONT_UNIT = MAIN_ONT_PATH + 'unit/';
const ONT_LENGTH = MAIN_ONT_PATH + 'length/';
const ONT_LENGTH_MODIFIER = MAIN_ONT_PATH + 'lengthModifier/';
const CLIMATE_ZONE_NAME = MAIN_ONT_PATH + 'climateZoneName/';
const CLIMATE_ZONE_DESCRIPTION = MAIN_ONT_PATH + 'climateZoneDescription/';
const TERRITORIAL_SEA = MAIN_ONT_PATH + 'territorialSea/';
const EXCLUSIVE_ECONOMIC_ZONE = MAIN_ONT_PATH + 'exclusiveEconomicZone/';
const CONTIGUOUS_ZONE = MAIN_ONT_PATH + 'contiguousZone/';
const CONTINENTAL_SHELF = MAIN_ONT_PATH + 'continentalShelf/';
const CONTINENTAL_SHELF_MODIFIER = MAIN_ONT_PATH + 'continentalShelfModifier/';
const SUPPLEMENTAL_EXPLANATION = MAIN_ONT_PATH + 'supplementalExplanation/';
const EXCLUSIVE_FISHING_ZONE = MAIN_ONT_PATH + 'exclusiveFishingZone/';
const RESOURCE_NAME = MAIN_ONT_PATH + 'resourceName/';
const MEAN_ELEVATION = MAIN_ONT_PATH + 'meanElevation/';
const LOWEST_POINT = MAIN_ONT_PATH + 'lowestPoint/';
const LOWEST_POINT_DESCRIPTION = MAIN_ONT_PATH + 'lowestPointDescription/';
const HIGHEST_POINT = MAIN_ONT_PATH + 'highestPoint/';
const HIGHEST_POINT_DESCRIPTION = MAIN_ONT_PATH + 'highestPointDescription/';

// Instance Paths
const INST_COUNTRY = MAIN_INSTANCE_PATH + 'Country/';
const INST_BORDER = MAIN_INSTANCE_PATH + 'Border/';
const INST_BORDER_COUNTRY = MAIN_INSTANCE_PATH + 'BorderCountryPair/';
const INST_BORDER_MAP = MAIN_INSTANCE_PATH + 'BorderMap/';
const INST_IMAGE = MAIN_INSTANCE_PATH + 'Image/';
const INST_REGION_MAP = MAIN_INSTANCE_PATH + 'RegionMap/';
const INST_FLAG = MAIN_INSTANCE_PATH + 'NationalFlag/';
const INST_DOMAIN_AREA = MAIN_INSTANCE_PATH + 'DomainArea/';
const INST_COAST = MAIN_INSTANCE_PATH + 'Coast/';
const INST_CLIMATE = MAIN_INSTANCE_PATH + 'Climate/';
const INST_CLIMATE_ZONE = MAIN_INSTANCE_PATH + 'ClimateZone/';
const INST_GEO_LOCATION = GEO_ONT_PATH + 'Location/';
const INST_MARITIME_CLAIM = MAIN_INSTANCE_PATH + 'MaritimeClaim/';
const INST_NATURAL_RESOURCE = MAIN_ONT_PATH + 'NaturalResource/';
const INST_ELEVATION = MAIN_ONT_PATH + 'Elevation/';
const INST_TERRAIN = MAIN_ONT_PATH + 'Terrain/';

const CUSTOM = {
	ONT_ELEVATION,
	HAS_ELEVATION,
	INST_ELEVATION,
	MEAN_ELEVATION,
	LOWEST_POINT,
	LOWEST_POINT_DESCRIPTION,
	HIGHEST_POINT,
	HIGHEST_POINT_DESCRIPTION,
	ONT_TERRAIN,
	HAS_TERRAIN,
	DESCRIPTION,
	INST_TERRAIN,
	ONT_NATURAL_RESOURCE,
	INST_NATURAL_RESOURCE,
	HAS_NATURAL_RESOURCE,
	RESOURCE_NAME,
	ONT_MARITIME_CLAIM,
	INST_MARITIME_CLAIM,
	HAS_MARITIME_CLAIM,
	TERRITORIAL_SEA,
	EXCLUSIVE_ECONOMIC_ZONE,
	CONTIGUOUS_ZONE,
	CONTINENTAL_SHELF,
	CONTINENTAL_SHELF_MODIFIER,
	SUPPLEMENTAL_EXPLANATION,
	EXCLUSIVE_FISHING_ZONE,
	ONT_BORDER,
	HAS_BORDER,
	INST_BORDER,
	TOTAL_BORDER_COUNTRIES,
	BORDER_LENGTH,
	ONT_BORDER_COUNTRY,
	INST_BORDER_COUNTRY,
	HAS_BORDER_COUNTRY,
	ONT_COUNTRY,
	INST_COUNTRY,
	HAS_COUNTRY,
	URL_BASE,
	MAIN_INSTANCE_PATH,
	MAIN_ONT_PATH,
	DATA_REQUEST_TIMEOUT,
	COUNTRY_BLACKLIST,
	HAS_BORDER_MAP,
	HAS_FLAG,
	HAS_LOCATION,
	HAS_REGION_MAP,
	HAS_SUPPLEMENTAL_IMG,
	LOCATION_URI,
	ISO_CODE,
	BACKGROUND,
	ONT_BORDER_MAP,
	INST_BORDER_MAP,
	ONT_IMAGE,
	INST_IMAGE,
	ONT_GEO_LOCATION,
	INST_GEO_LOCATION,
	ONT_REGION_MAP,
	INST_REGION_MAP,
	ONT_FLAG,
	INST_FLAG,
	LOCATION_DESCRIPTION,
	CONTENT_DESCRIPTION,
	MAP_REFERENCES,
	IMAGE_DIMENSIONS,
	IMAGE_SIZE,
	ONT_TOTAL_AREA,
	ONT_LAND_AREA,
	ONT_WATER_AREA,
	ONT_AREA_COMPARATIVE,
	ONT_AREA_RANK,
	ONT_UNIT,
	ONT_LENGTH,
	ONT_LENGTH_MODIFIER,
	ONT_DOMAIN_AREA,
	HAS_DOMAIN_AREA,
	INST_DOMAIN_AREA,
	ONT_COAST,
	HAS_COAST,
	INST_COAST,
	ONT_CLIMATE,
	ONT_CLIMATE_ZONE,
	HAS_CLIMATE,
	HAS_CLIMATE_ZONE,
	INST_CLIMATE,
	INST_CLIMATE_ZONE,
	CLIMATE_ZONE_NAME,
	CLIMATE_ZONE_DESCRIPTION,
	TOTAL_BORDER
};

const RDFS = {
	label: 'http://www.w3.org/2000/01/rdf-schema#label'
};
class Constants {
	WGS84_POS = WGS84_POS;
	CUSTOM = CUSTOM;
	RDFS = RDFS;
};

export const consts = new Constants();