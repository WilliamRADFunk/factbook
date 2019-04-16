import { EntityListWrapper } from "../models/entity-list-wrapper";
import { ImageScrapableObject } from "../models/image-scrapable-object";

class GlobalStore {
	public LOG_FILE_NAME: string = '';
	public LOG_STREAM: any = null;
	public IMAGES_TO_SCRAPE: ImageScrapableObject[] = [];
	public countriesInList: string[] = [];

	public agriculturalLands: EntityListWrapper = {};
	public arableLands: EntityListWrapper = {};
	public artificiallyIrrigatedLands: EntityListWrapper = {};
	public borderCountries: EntityListWrapper = {};
	public borderMaps: EntityListWrapper = {};
	public borders: EntityListWrapper = {};
	public climates: EntityListWrapper = {};
	public climateZones: EntityListWrapper = {};
	public coasts: EntityListWrapper = {};
	public countries: EntityListWrapper = {};
	public domainAreas: EntityListWrapper = {};
	public elevations: EntityListWrapper = {};
	public forestLands: EntityListWrapper = {};
	public images: EntityListWrapper = {};
	public geographicNotes: EntityListWrapper = {};
	public landUses: EntityListWrapper = {};
	public locations: EntityListWrapper = {};
	public maritimeClaims: EntityListWrapper = {};
	public nationalFlags: EntityListWrapper = {};
	public naturalHazards: EntityListWrapper = {};
	public naturalResources: EntityListWrapper = {};
	public otherLands: EntityListWrapper = {};
	public permanentCropsLands: EntityListWrapper = {};
	public permanentPastureLands: EntityListWrapper = {};
	public regionMaps: EntityListWrapper = {};
	public terrains: EntityListWrapper = {};
}

export const store = new GlobalStore();