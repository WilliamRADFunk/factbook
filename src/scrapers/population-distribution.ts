import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';

export function getPopDist(cheerioElem: CheerioSelector, country: string, countryId: string) {
	cheerioElem('#field-population-distribution').each((index: number, element: CheerioElement) => {
        const popGrd = cheerioElem(element).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (popGrd) {
            store.countries[countryId].datatypeProperties[consts.ONTOLOGY.DT_POPULATION_DISTRIBUTION] = popGrd;
        }
    });
};