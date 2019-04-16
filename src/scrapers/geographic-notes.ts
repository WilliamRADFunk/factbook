import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { parsedSingleLine } from './scraper-forms/parsed-single-line';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getGeographicNotes(cheerioElem: CheerioSelector, country: string, countryId: string) {
    const objectProperties = store.countries[countryId].objectProperties;
	const prevHasList = objectProperties.filter(rel => rel[consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE]);
    let bailOut = true;
    cheerioElem('#field-geography-note').each(function() {
        bailOut = false;
    });
    if (bailOut) {
        return;
    }
    let useOptionA = false;
    cheerioElem('#field-geography-note > div.category_data.subfield.text').each(function() {
        useOptionA = true;
    });
    if (useOptionA) {
        let origParams = {
            cheerioElem,
            country,
            countryId
        };
        parsedSingleLine(
            origParams,
            '#field-geography-note',
            'HAS_GEOGRAPHIC_NOTE',
            'INST_GEOGRAPHIC_NOTE',
            'ONT_GEOGRAPHIC_NOTE',
            'geographicNotes',
            'DT_DESCRIPTION',
            'Geographic Note',
            ';');
    } else {
        cheerioElem('#field-geography-note > div.category_data.note').each((index: number, element: CheerioElement) => {
            let geographicalNotes = cheerioElem(element).text().trim().replace(/\\n/g, '').trim();
            const notes = geographicalNotes.split(/note [0-9]+\:/);
            if (notes.length) {
                notes.forEach(note => {
                    let objectProp = {};
                    const dataPropItem = note.trim();
                    const guid = consts.ONTOLOGY.INST_GEOGRAPHIC_NOTE + getUuid(dataPropItem);
                    const hasPropAlready = prevHasList.some(p => p[consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE]['@id'].includes(guid));
                    if (dataPropItem && !hasPropAlready) {
                        if (store.geographicNotes[guid]) {
                            objectProp[consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE] = store.geographicNotes[guid];
                        } else {
                            objectProp = entityMaker(
                                consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE,
                                consts.ONTOLOGY.ONT_GEOGRAPHIC_NOTE,
                                guid,
                                `Geographic Note (${dataPropItem})`);
                            store.geographicNotes[guid] = objectProp[consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE];
                        }
                        objectProp[consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE].datatypeProperties[consts.ONTOLOGY.DT_DESCRIPTION] = dataPropItem;
                        store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_GEOGRAPHIC_NOTE, objectProp));
                    }
                });
            }
        });
    }
};