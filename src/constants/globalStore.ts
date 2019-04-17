import { CountryReference } from "../models/country-reference";
import { EntityListWrapper } from "../models/entity-list-wrapper";
import { ImageScrapableObject } from "../models/image-scrapable-object";
import { consoleError, consoleLog } from "../utils/logger";

// const noop = () => { /* Noop */ };
const noop = (a, b) => { consoleLog(`${a} is ${Math.floor(b * 100)} done`) };

class GlobalStore {
	public LOG_FILE_NAME: string = '';
	public LOG_STREAM: any = null;
	public IMAGES_TO_SCRAPE: ImageScrapableObject[] = [];
	public countriesInList: CountryReference[] = [];
	public debugLogger: any = consoleLog;
	public errorLogger: any = consoleError;
	public progressLogger: any = noop;
	public failedCountries: CountryReference[] = [];
	public failedImages: ImageScrapableObject[] = [];

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