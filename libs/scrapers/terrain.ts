import { parsedSingleLine } from './scraper-forms/parsed-single-line';

export function getTerrains(cheerioElem: CheerioSelector, country: string, countryId: string) {
    let bailOut = true;
    cheerioElem('#field-terrain').each(function() {
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
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
		'DESCRIPTION',
		'Terrain',
		';');
};