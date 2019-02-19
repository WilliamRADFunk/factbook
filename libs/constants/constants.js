const URL_BASE = 'https://www.cia.gov/library/publications/the-world-factbook/';
const MAIN_INSTANCE_PATH = 'https://www.funk.com/instance/';
const MAIN_ONT_PATH = 'https://www.funk.com/ont/';
const DATA_REQUEST_TIMEOUT = 20000;
const COUNTRY_BLACKLIST = [
	"please select a country to view",
	"world"
];



const HAS_BORDER_MAP = MAIN_ONT_PATH + 'hasBorderMap/';
const HAS_FLAG = MAIN_ONT_PATH + 'hasFlag/';
const HAS_LOCATION = MAIN_ONT_PATH + 'hasLocation/';
const HAS_REGION_MAP = MAIN_ONT_PATH + 'hasRegionMap/';
const HAS_SUPPLEMENTAL_IMG = MAIN_ONT_PATH + 'hasSupplementalImg/';
const ORIGINAL_IMAGE_URL = MAIN_ONT_PATH + 'originalImageURL/';
const ONT_BACKGROUND = MAIN_ONT_PATH + 'background/';
const ONT_BORDER_MAP = MAIN_ONT_PATH + 'borderMap/';
const INST_BORDER_MAP = MAIN_INSTANCE_PATH + 'borderMap/';
const ONT_IMAGE = MAIN_ONT_PATH + 'image/';
const INST_IMAGE = MAIN_INSTANCE_PATH + 'image/';
const ONT_GEO_LOCATION = 'http://www.w3.org/2003/01/geo/wgs84_pos#location';
const INST_GEO_LOCATION = MAIN_INSTANCE_PATH + 'hasLocation/';
const ONT_REGION_MAP = MAIN_ONT_PATH + 'regionMap/';
const INST_REGION_MAP = MAIN_INSTANCE_PATH + 'regionMap/';
const ONT_FLAG = MAIN_ONT_PATH + 'flag/';
const INST_FLAG = MAIN_INSTANCE_PATH + 'flag/';
const ONT_DESCRIPTION = MAIN_ONT_PATH + 'description/';
const ONT_LOCATION_DESCRIPTION = MAIN_ONT_PATH + 'locationDescription/';
const ONT_MAP_REFERENCES = MAIN_ONT_PATH + 'mapReferences/';
const IMAGE_DIMENSIONS = ONT_IMAGE + 'dimenstions/';
const IMAGE_SIZE = ONT_IMAGE + 'size/';

const POS = 'http://www.w3.org/2003/01/geo/wgs84_pos#';

const WGS84_POS = {
	LAT: POS + 'lat',
	LONG: POS + 'long',
	LAT_LONG: POS + 'lat_long',
	LOCATION: POS + 'location',
	SPATIAL_THING: POS + 'SpatialThing',
	ALT: POS + 'alt',
	POINT: POS + 'Point'
};

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
	ORIGINAL_IMAGE_URL,
	ONT_BACKGROUND,
	ONT_DESCRIPTION,
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
	ONT_LOCATION_DESCRIPTION,
	ONT_MAP_REFERENCES,
	IMAGE_DIMENSIONS,
	IMAGE_SIZE
};

module.exports = {
	WGS84_POS,
	CUSTOM
};