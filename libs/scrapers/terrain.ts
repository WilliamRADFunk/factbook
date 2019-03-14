import { parsedSingleLine } from './scraper-forms/parsed-single-line';

export function getTerrains(cheerioElem, country, countryId) {
	let origParams = {
		cheerioElem,
		country,
		countryId
	};
	parsedSingleLine(
		origParams,
		'#field-terrain',
		'HAS_TERRAIN',
		'INST_TERRAIN',
		'ONT_TERRAIN',
		'terrains',
		'terrainDescription',
		'Terrain',
		';');
};