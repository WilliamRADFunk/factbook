import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';

export function countryToId(country) {
    return consts.CUSTOM.INST_COUNTRY + getUuid(country);
};
