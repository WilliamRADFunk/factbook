import { entityMaker, entityRefMaker } from 'funktologies';
import * as htmlToText from 'html-to-text';
import * as getUuid from 'uuid-by-string';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';

export function getSupplementalImages(cheerioElem: CheerioSelector, country: string, countryId: string) {
    const objectProperties = store.countries[countryId].objectProperties;
    cheerioElem('div.item.photo-all').each((index: number, element: CheerioElement) => {
        const suppImages = objectProperties.filter(rel => rel[consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG]);

		const a = cheerioElem(element).find('img').attr('src');
		let b = cheerioElem(element).find('img').attr('alt');
		const c = cheerioElem(element).find(cheerioElem('div.carousel-photo-info .photoInfo .flag_description_text'));
		const imageProps: string[] = [];
		c.each(() => { imageProps.push(cheerioElem(element).text().trim()); });
		b = b && htmlToText.fromString(b);
		let imgId;
		let suppImgUrl;
        if (a && a.replace('../', '')) {
			const cleanSrc = a.replace('../', '');
			imgId = consts.ONTOLOGY.INST_IMAGE + getUuid(cleanSrc);
            suppImgUrl = consts.BASE.URL_BASE + cleanSrc;
		}
        if (suppImgUrl && !suppImages.some(img => img[consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG]['@id'].includes(imgId))) {
			let objectProp = {};
			if (store.images[imgId]) {
				objectProp[consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG] = store.images[imgId];
			} else {
                objectProp = entityMaker(
                    consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG,
                    consts.ONTOLOGY.ONT_IMAGE,
                    imgId,
                    `Supplemental Image for ${country}`);
				store.images[imgId] = objectProp[consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG];
			}
			store.countries[countryId].objectProperties.push(entityRefMaker(consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG, objectProp));

			const datatypeProp = {};
			datatypeProp[consts.ONTOLOGY.DT_LOCATOR_URI] = suppImgUrl;
			datatypeProp[consts.ONTOLOGY.DT_CONTENT_DESCRIPTION] = b || null;
			datatypeProp[consts.ONTOLOGY.DT_IMAGE_DIMENSIONS] = imageProps[0] || 'N/A';
			datatypeProp[consts.ONTOLOGY.DT_IMAGE_SIZE] = imageProps[1] || 'N/A';
			objectProp[consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG].datatypeProperties = datatypeProp;

			const pathSplit: string[] = suppImgUrl.split('/');
			const fileName: string = pathSplit[pathSplit.length - 1].split('?')[0].toLowerCase();
			datatypeProp[consts.ONTOLOGY.DT_MIME_TYPE] = fileName.split('.')[1];
			datatypeProp[consts.ONTOLOGY.DT_COLLECTION_TIMESTAMP] = (new Date()).toISOString();
			datatypeProp[consts.ONTOLOGY.DT_CONTENTS] = fileName;

			const options = {
				dest: `dist/images/${fileName}`,
				timeout: consts.BASE.DATA_REQUEST_TIMEOUT,
				url: suppImgUrl
			}

			store.IMAGES_TO_SCRAPE.push({
				fileName,
				options
			});
		}
    });
};