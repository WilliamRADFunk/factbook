import { parsedSingleLine } from './scraper-forms/parsed-single-line';

export function getTerrains(cheerioElem: CheerioSelector, country: string, countryId: string) {
    let bailOut = true;
    cheerioElem('#field-terrain').each(() => {
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
	const origParams = {
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
		'DT_DESCRIPTION',
		'Terrain',
		';');
};