import { EntityListWrapper } from "../models/entity-list-wrapper";
import { ImageScrapableObject } from "../models/image-scrapable-object";

class GlobalStore {
	LOG_FILE_NAME: string = '';
	LOG_STREAM: any = null;
	IMAGES_TO_SCRAPE: ImageScrapableObject[] = [];
	countriesInList: string[] = [];

	agriculturalLands: EntityListWrapper = {};
	arableLands: EntityListWrapper = {};
	artificiallyIrrigatedLands: EntityListWrapper = {};
	borderCountries: EntityListWrapper = {};
	borderMaps: EntityListWrapper = {};
	borders: EntityListWrapper = {};
	climates: EntityListWrapper = {};
	climateZones: EntityListWrapper = {};
	coasts: EntityListWrapper = {};
	countries: EntityListWrapper = {};
	domainAreas: EntityListWrapper = {};
	elevations: EntityListWrapper = {};
	forestLands: EntityListWrapper = {};
	images: EntityListWrapper = {};
	geographicNotes: EntityListWrapper = {};
	landUses: EntityListWrapper = {};
	locations: EntityListWrapper = {};
	maritimeClaims: EntityListWrapper = {};
	nationalFlags: EntityListWrapper = {};
	naturalHazards: EntityListWrapper = {};
	naturalResources: EntityListWrapper = {};
	otherLands: EntityListWrapper = {};
	permanentCropsLands: EntityListWrapper = {};
	permanentPastureLands: EntityListWrapper = {};
	regionMaps: EntityListWrapper = {};
	terrains: EntityListWrapper = {};
}

export const store = new GlobalStore();