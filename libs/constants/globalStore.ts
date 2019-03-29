class GlobalStore {
	LOG_FILE_NAME = '';
	LOG_STREAM = null;
	IMAGES_TO_SCRAPE = [];

	agriculturalLands = {};
	arableLands = {};
	artificiallyIrrigatedLands = {};
	borderCountries = {};
	borderMaps = {};
	borders = {};
	climates = {};
	climateZones = {};
	coasts = {};
	countries = {};
	countriesInList = [];
	domainAreas = {};
	elevations = {};
	forestLands = {};
	images = {};
	geographicNotes = {};
	landUses = {};
	locations = {};
	maritimeClaims = {};
	nationalFlags = {};
	naturalHazards = {};
	naturalResources = {};
	otherLands = {};
	permanentCropsLands = {};
	permanentPastureLands = {};
	regionMaps = {};
	terrains = {};
}

export const store = new GlobalStore();