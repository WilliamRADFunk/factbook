import { store } from "../constants/globalStore";

export function flushStore() {
    store.agriculturalLands = {};
	store.arableLands = {};
	store.artificiallyIrrigatedLands = {};
	store.borderCountries = {};
	store.borderMaps = {};
	store.borders = {};
	store.climates = {};
	store.climateZones = {};
	store.coasts = {};
	store.countries = {};
	store.countriesInList = [];
	store.domainAreas = {};
	store.elevations = {};
	store.forestLands = {};
	store.images = {};
	store.geographicNotes = {};
	store.landUses = {};
	store.locations = {};
	store.maritimeClaims = {};
	store.nationalFlags = {};
	store.naturalHazards = {};
	store.naturalResources = {};
	store.otherLands = {};
	store.permanentCropsLands = {};
	store.permanentPastureLands = {};
	store.regionMaps = {};
	store.terrains = {};
	
	store.jsonLD = [];
	store.jsonNT = '';
};