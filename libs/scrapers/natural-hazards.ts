import { parsedSingleLineCaveat } from './scraper-forms/parsed-single-line-caveat';

export function getNaturalHazard(cheerioElem: CheerioSelector, country: string, countryId: string) {
    let bailOut = true;
    cheerioElem('#field-natural-hazards').each(function() {
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
	parsedSingleLineCaveat(
		origParams,
		'#field-natural-hazards',
		'HAS_NATURAL_HAZARD',
		'INST_NATURAL_HAZARD',
		'ONT_NATURAL_HAZARD',
		'naturalHazards',
		'DESCRIPTION',
		'Natural Hazard',
		';',
		'volcanism:');
};