"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GlobalStore = /** @class */ (function () {
    function GlobalStore() {
        this.LOG_FILE_NAME = '';
        this.LOG_STREAM = null;
        this.IMAGES_TO_SCRAPE = [];
        this.countriesInList = [];
        this.agriculturalLands = {};
        this.arableLands = {};
        this.artificiallyIrrigatedLands = {};
        this.borderCountries = {};
        this.borderMaps = {};
        this.borders = {};
        this.climates = {};
        this.climateZones = {};
        this.coasts = {};
        this.countries = {};
        this.domainAreas = {};
        this.elevations = {};
        this.forestLands = {};
        this.images = {};
        this.geographicNotes = {};
        this.landUses = {};
        this.locations = {};
        this.maritimeClaims = {};
        this.nationalFlags = {};
        this.naturalHazards = {};
        this.naturalResources = {};
        this.otherLands = {};
        this.permanentCropsLands = {};
        this.permanentPastureLands = {};
        this.regionMaps = {};
        this.terrains = {};
    }
    return GlobalStore;
}());
exports.store = new GlobalStore();
