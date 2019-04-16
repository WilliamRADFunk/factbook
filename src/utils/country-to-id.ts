import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';

export function countryToId(country: string): string {
    return consts.ONTOLOGY.INST_COUNTRY + getUuid(country);
};
