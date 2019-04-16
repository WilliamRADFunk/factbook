import { parsedThreeValStrings } from './scraper-forms/parsed-three-val-strings';

export function getIrrigatedLand(cheerioElem: CheerioSelector, country: string, countryId: string) {
    let bailOut = true;
    cheerioElem('#field-natural-resources').each(() => {
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
	parsedThreeValStrings(
		origParams,
		'#field-irrigated-land',
		'HAS_ARTIFICIALLY_IRRIGATED_LAND',
		'INST_ARTIFICIALLY_IRRIGATED_LAND',
		'ONT_ARTIFICIALLY_IRRIGATED_LAND',
		'artificiallyIrrigatedLands',
        ['DT_TOTAL_AREA', 'DT_UNIT', 'DT_LAST_ESTIMATED'],
        country,
		'Artificially Irrigated Land',
		[/[a-zA-Z]/g, /[^0-9\-\.\,]/g, /\(/g]);
};