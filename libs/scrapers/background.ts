import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';

export function getBackground(cheerioElem, country, countryId) {
	cheerioElem('#field-background').each(function() {
        const bckGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (bckGrd) {
            store.countries[countryId].datatypeProperties[consts.CUSTOM.BACKGROUND] = bckGrd;
        }
    });
};