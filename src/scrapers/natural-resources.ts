import { parsedSingleLine } from './scraper-forms/parsed-single-line';

export function getNaturalResources(cheerioElem: CheerioSelector, country: string, countryId: string) {
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
	parsedSingleLine(
		origParams,
		'#field-natural-resources',
		'HAS_NATURAL_RESOURCE',
		'INST_NATURAL_RESOURCE',
		'ONT_NATURAL_RESOURCE',
		'naturalResources',
		'DT_RESOURCE_NAME',
		'Natural Resource',
		',');
};