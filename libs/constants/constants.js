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
const ONT_FLAG = MAIN_ONT_PATH + 'NationalFlag/';
const ONT_BORDER_MAP = MAIN_ONT_PATH + 'BorderMap/';
const ONT_IMAGE = MAIN_ONT_PATH + 'Image/';
const ONT_GEO_LOCATION = WGS84_POS.LOCATION;
const ONT_REGION_MAP = MAIN_ONT_PATH + 'RegionMap/';

// ObjectProperty Paths
const HAS_BORDER_MAP = MAIN_ONT_PATH + 'hasBorderMap/';
const HAS_FLAG = MAIN_ONT_PATH + 'hasNationalFlag/';
const HAS_LOCATION = MAIN_ONT_PATH + 'hasLocation/';
const HAS_REGION_MAP = MAIN_ONT_PATH + 'hasRegionMap/';
const HAS_GEO_LOCATION = MAIN_INSTANCE_PATH + 'hasLocation/';
const HAS_SUPPLEMENTAL_IMG = MAIN_ONT_PATH + 'hasSupplementalImage/';

const LOCATION_URI = MAIN_ONT_PATH + 'locatorURI/';
const CONTENTS = ASSET_ONT_PATH + 'contents/';

// DatatypeProperty Paths
const BACKGROUND = MAIN_ONT_PATH + 'background/';
const LOCATION_DESCRIPTION = MAIN_ONT_PATH + 'locationDescription/';
const IMAGE_DIMENSIONS = MAIN_ONT_PATH + 'imageDimensions/';
const IMAGE_SIZE = MAIN_ONT_PATH + 'imageSize/';
const MAP_REFERENCES = MAIN_ONT_PATH + 'mapReferences/';

// Instance Paths
const INST_BORDER_MAP = MAIN_INSTANCE_PATH + 'BorderMap/';
const INST_IMAGE = MAIN_INSTANCE_PATH + 'Image/';
const INST_REGION_MAP = MAIN_INSTANCE_PATH + 'RegionMap/';
const INST_FLAG = MAIN_INSTANCE_PATH + 'NationalFlag/';


const ONT_TOTAL_AREA = MAIN_ONT_PATH + 'totalArea/';
const ONT_LAND_AREA = MAIN_ONT_PATH + 'landArea/';
const ONT_WATER_AREA = MAIN_ONT_PATH + 'waterArea/';
const ONT_AREA_COMPARATIVE = MAIN_ONT_PATH + 'areaComparative/';
const ONT_AREA_RANK = MAIN_ONT_PATH + 'areaRank/';
const ONT_AREA_UNIT = MAIN_ONT_PATH + 'areaUnit/';
const ONT_CLIMATE = MAIN_ONT_PATH + 'climate/';
const ONT_COAST_LENGTH = MAIN_ONT_PATH + 'coastLength/';
const ONT_COAST_LENGTH_UNIT = MAIN_ONT_PATH + 'coastLengthUnit/';
const ONT_COAST_LENGTH_MODIFIER = MAIN_ONT_PATH + 'coastLengthModifier/';

const CUSTOM = {
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
	BACKGROUND,
	ONT_DESCRIPTION,
	ONT_BORDER_MAP,
	INST_BORDER_MAP,
	ONT_IMAGE,
	INST_IMAGE,
	ONT_GEO_LOCATION,
	HAS_GEO_LOCATION,
	ONT_REGION_MAP,
	INST_REGION_MAP,
	ONT_FLAG,
	INST_FLAG,
	LOCATION_DESCRIPTION,
	MAP_REFERENCES,
	IMAGE_DIMENSIONS,
	IMAGE_SIZE,
	ONT_TOTAL_AREA,
	ONT_LAND_AREA,
	ONT_WATER_AREA,
	ONT_AREA_COMPARATIVE,
	ONT_AREA_RANK,
	ONT_AREA_UNIT,
	ONT_CLIMATE,
	ONT_COAST_LENGTH,
	ONT_COAST_LENGTH_UNIT,
	ONT_COAST_LENGTH_MODIFIER
};

module.exports = {
	WGS84_POS,
	CUSTOM
};