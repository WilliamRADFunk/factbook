import { consts } from "../constants/constants";

export function getCountryURL(abbrev: string): string {
    return consts.BASE.URL_COUNTRY_BASE + abbrev + '.html';
}