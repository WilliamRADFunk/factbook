import { parsedSingleLine } from './scraper-forms/parsed-single-line';

export function getNaturalResources(cheerioElem, country, countryId) {
    let bailOut = true;
    cheerioElem('#field-natural-resources').each(function() {
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
		'#field-natural-resources',
		'HAS_NATURAL_RESOURCE',
		'INST_NATURAL_RESOURCE',
		'ONT_NATURAL_RESOURCE',
		'naturalResources',
		'resourceName',
		'Natural Resource',
		',');
};