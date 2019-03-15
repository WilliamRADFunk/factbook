import { getBackground } from './background';
import { getBorders } from './borders';
import { getBorderMapImg } from './border-map-image';
import { getClimate } from './climate';
import { getCoastLength } from './coast-length';
import { getArea } from './domain-area';
import { getGeography } from './geography';
import { getFlag } from './national-flag';
import { getRegionMapImg } from './region-map-image';
import { getSupplementalImages } from './supplemental-image';
import { getMaritimeClaims } from './maritime-claims';
import { getNaturalResources } from './natural-resources';
import { getElevation } from './elevation';
import { getTerrains } from './terrain';

export const dataScrapers = {
	getArea,
	getBackground,
	getBorderMapImg,
	getBorders,
	getClimate,
	getCoastLength,
	getFlag,
	getGeography,
	getRegionMapImg,
	getSupplementalImages,
	getMaritimeClaims,
	getNaturalResources,
	getElevation,
	getTerrains
};
