"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var background_1 = require("./background");
var border_map_image_1 = require("./border-map-image");
var borders_1 = require("./borders");
var climate_1 = require("./climate");
var coast_length_1 = require("./coast-length");
var domain_area_1 = require("./domain-area");
var elevation_1 = require("./elevation");
var geographic_notes_1 = require("./geographic-notes");
var geography_1 = require("./geography");
var geography_coordinates_1 = require("./geography-coordinates");
var irrigated_land_1 = require("./irrigated-land");
var land_uses_1 = require("./land-uses");
var maritime_claims_1 = require("./maritime-claims");
var national_flag_1 = require("./national-flag");
var natural_hazards_1 = require("./natural-hazards");
var natural_resources_1 = require("./natural-resources");
var population_distribution_1 = require("./population-distribution");
var region_map_image_1 = require("./region-map-image");
var supplemental_image_1 = require("./supplemental-image");
var terrain_1 = require("./terrain");
exports.dataScrapers = {
    getArea: domain_area_1.getArea,
    getBackground: background_1.getBackground,
    getBorderMapImg: border_map_image_1.getBorderMapImg,
    getBorders: borders_1.getBorders,
    getClimate: climate_1.getClimate,
    getCoastLength: coast_length_1.getCoastLength,
    getElevation: elevation_1.getElevation,
    getFlag: national_flag_1.getFlag,
    getGeographicNotes: geographic_notes_1.getGeographicNotes,
    getGeography: geography_1.getGeography,
    getGeographyCoordinates: geography_coordinates_1.getGeographyCoordinates,
    getIrrigatedLand: irrigated_land_1.getIrrigatedLand,
    getLandUses: land_uses_1.getLandUses,
    getMaritimeClaims: maritime_claims_1.getMaritimeClaims,
    getNaturalHazard: natural_hazards_1.getNaturalHazard,
    getNaturalResources: natural_resources_1.getNaturalResources,
    getPopDist: population_distribution_1.getPopDist,
    getRegionMapImg: region_map_image_1.getRegionMapImg,
    getSupplementalImages: supplemental_image_1.getSupplementalImages,
    getTerrains: terrain_1.getTerrains
};
