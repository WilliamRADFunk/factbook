import * as getUuid from 'uuid-by-string';
import * as htmlToText from 'html-to-text';
import * as download from 'image-downloader';
import { promise as DataURI } from 'datauri';

import { consts } from '../constants/constants';
import { store } from '../constants/globalStore';
import { entityMaker } from '../utils/entity-maker';
import { entityRefMaker } from '../utils/entity-ref-maker';

export function getSupplementalImages(cheerioElem: CheerioSelector, country: string, countryId: string) {
    const objectProperties = store.countries[countryId].objectProperties;
    cheerioElem('div.item.photo-all').each(function() {
        const suppImages = objectProperties.filter(rel => rel[consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG]);

		const a = cheerioElem(this).find('img').attr('src');
		let b = cheerioElem(this).find('img').attr('alt');
		const c = cheerioElem(this).find(cheerioElem('div.carousel-photo-info .photoInfo .flag_description_text'));
		const imageProps = [];
		c.each(function() { imageProps.push(cheerioElem(this).text().trim()); });
		b = b && htmlToText.fromString(b);
		let imgId, suppImgUrl;
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
			datatypeProp[consts.ONTOLOGY.LOCATION_URI] = suppImgUrl;
			datatypeProp[consts.ONTOLOGY.CONTENT_DESCRIPTION] = b || null;
			datatypeProp[consts.ONTOLOGY.IMAGE_DIMENSIONS] = imageProps[0] || 'N/A';
			datatypeProp[consts.ONTOLOGY.IMAGE_SIZE] = imageProps[1] || 'N/A';
			objectProp[consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG].datatypeProperties = datatypeProp;

			const pathSplit: string[] = suppImgUrl.split('/');
			const fileName = pathSplit[pathSplit.length - 1].split('?')[0].toLowerCase();
			datatypeProp[consts.ONTOLOGY.MIME_TYPE] = fileName.split('.')[1];
			datatypeProp[consts.ONTOLOGY.COLLECTION_TIMESTAMP] = (new Date()).toISOString();

			const options = {
				url: suppImgUrl,
				dest: `dist/images/${fileName}`
			}

			store.IMAGE_PROMISES.push(
				download.image(options)
					.then(({ filename, image }) => {
						console.log('File saved to', filename);
						store.ENCODE_PROMISES.push(DataURI(filename)
							.then(content => {
								console.log('File encoded', filename);
								datatypeProp[consts.ONTOLOGY.CONTENTS] = content;
							})
							.catch(err => {
								console.error('~~~~ Failed to encode: ', filename, err);
							})
						);
					})
					.catch((err) => {
						console.error('~~~~ Failed to download: ', fileName, err);
					})
			);
		}
    });
};