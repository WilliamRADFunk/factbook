import { getArea } from './domain-area';
import { getBackground } from './background';
import { getBorderMapImg } from './border-map-image';
import { getBorders } from './borders';
import { getClimate } from './climate';
import { getCoastLength } from './coast-length';
import { getGeography } from './geography';
import { getIrrigatedLand } from './irrigated-land';
import { getElevation } from './elevation';
import { getFlag } from './national-flag';
import { getLandUses } from './land-uses';
import { getMaritimeClaims } from './maritime-claims';
import { getNaturalHazard } from './natural-hazards';
import { getNaturalResources } from './natural-resources';
import { getPopDist } from './population-distribution';
import { getRegionMapImg } from './region-map-image';
import { getSupplementalImages } from './supplemental-image';
import { getTerrains } from './terrain';

export const dataScrapers = {
	getArea,
	getBackground,
	getBorderMapImg,
	getBorders,
	getClimate,
	getCoastLength,
	getElevation,
	getFlag,
	getGeography,
	getIrrigatedLand,
	getLandUses,
	getMaritimeClaims,
	getNaturalHazard,
	getNaturalResources,
	getPopDist,
	getRegionMapImg,
	getSupplementalImages,
	getTerrains
};
