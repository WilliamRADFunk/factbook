import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';

export function getBackground(cheerioElem: CheerioSelector, country: string, countryId: string): void {
	cheerioElem('#field-background').each((index: number, element: CheerioElement) => {
        const bckGrd = cheerioElem(element).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (bckGrd) {
            store.countries[countryId].datatypeProperties[consts.ONTOLOGY.DT_BACKGROUND] = bckGrd;
        }
    });
};