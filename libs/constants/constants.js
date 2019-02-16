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
const HAS_REGION_MAP = MAIN_ONT_PATH + 'hasRegionMap/';
const HAS_SUPPLEMENTAL_IMG = MAIN_ONT_PATH + 'hasSupplementalImg/';
const ORIGINAL_IMAGE_URL = MAIN_ONT_PATH + 'originalImageURL/';
const ONT_BACKGROUND = MAIN_ONT_PATH + 'background/';
const ONT_BORDER_MAP = MAIN_ONT_PATH + 'borderMap/';
const INST_BORDER_MAP = MAIN_INSTANCE_PATH + 'borderMap/';
const ONT_IMAGE = MAIN_ONT_PATH + 'image/';
const INST_IMAGE = MAIN_INSTANCE_PATH + 'image/';
const ONT_REGION_MAP = MAIN_ONT_PATH + 'regionMap/';
const INST_REGION_MAP = MAIN_INSTANCE_PATH + 'regionMap/';
const ONT_FLAG = MAIN_ONT_PATH + 'flag/';
const INST_FLAG = MAIN_INSTANCE_PATH + 'flag/';
const ONT_DESCRIPTION = MAIN_ONT_PATH + 'description/';
const IMAGE_DIMENSIONS = ONT_IMAGE + 'dimenstions/';
const IMAGE_SIZE = ONT_IMAGE + 'size/';

module.exports = {
	URL_BASE,
	MAIN_INSTANCE_PATH,
	MAIN_ONT_PATH,
	DATA_REQUEST_TIMEOUT,
	COUNTRY_BLACKLIST,
	HAS_BORDER_MAP,
	HAS_FLAG,
	HAS_REGION_MAP,
	HAS_SUPPLEMENTAL_IMG,
	ORIGINAL_IMAGE_URL,
	ONT_BACKGROUND,
	ONT_DESCRIPTION,
	ONT_BORDER_MAP,
	INST_BORDER_MAP,
	ONT_IMAGE,
	INST_IMAGE,
	ONT_REGION_MAP,
	INST_REGION_MAP,
	ONT_FLAG,
	INST_FLAG,
	IMAGE_DIMENSIONS,
	IMAGE_SIZE
};