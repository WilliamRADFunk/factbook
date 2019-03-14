import * as getUuid from 'uuid-by-string';
import * as htmlToText from 'html-to-text';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getSupplementalImages(cheerioElem, country, countryId) {
    let objectProperties = store.countries[countryId].objectProperties;
    cheerioElem('div.item.photo-all').each(function() {
        let suppImages = objectProperties.filter(rel => rel[consts.CUSTOM.HAS_SUPPLEMENTAL_IMG]);

		var a = cheerioElem(this).find('img').attr('src');
		var b = cheerioElem(this).find('img').attr('alt');
		var c = cheerioElem(this).find(cheerioElem('div.carousel-photo-info .photoInfo .flag_description_text'));
		var imageProps = [];
		c.each(function() { imageProps.push(cheerioElem(this).text().trim()); });
		b = b && htmlToText.fromString(b);
		var imgId, suppImgUrl;
        if (a && a.replace('../', '')) {
			var cleanSrc = a.replace('../', '');
			imgId = consts.CUSTOM.INST_IMAGE + getUuid(cleanSrc);
            suppImgUrl = consts.CUSTOM.URL_BASE + cleanSrc;
		}
        if (suppImgUrl && !suppImages.some(img => img[consts.CUSTOM.HAS_SUPPLEMENTAL_IMG].id.includes(imgId))) {
			var objectProp = {};
			if (store.images[imgId]) {
				objectProp[consts.CUSTOM.HAS_SUPPLEMENTAL_IMG] = store.images[imgId];
			} else {
                objectProp = entityMaker(
                    consts.CUSTOM.HAS_SUPPLEMENTAL_IMG,
                    consts.CUSTOM.ONT_IMAGE,
                    imgId,
                    'Supplemental Image');
				store.images[imgId] = objectProp[consts.CUSTOM.HAS_SUPPLEMENTAL_IMG];
			}
			store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_SUPPLEMENTAL_IMG, objectProp));

			var datatypeProp = {};
			datatypeProp[consts.CUSTOM.LOCATION_URI] = suppImgUrl;
			datatypeProp[consts.CUSTOM.CONTENT_DESCRIPTION] = b || null;
			datatypeProp[consts.CUSTOM.IMAGE_DIMENSIONS] = imageProps[0] || 'N/A';
			datatypeProp[consts.CUSTOM.IMAGE_SIZE] = imageProps[1] || 'N/A';

			objectProp[consts.CUSTOM.HAS_SUPPLEMENTAL_IMG].datatypeProperties = datatypeProp;
		}
        // TODO: scrape physical image from url and store it.
    });
};