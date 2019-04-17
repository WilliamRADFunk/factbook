import * as download from 'image-downloader';

import { store } from "../constants/globalStore";
import { ImageScrapableObject } from "../models/image-scrapable-object";

export function downloadImage(img: ImageScrapableObject): Promise<any> {
    return download.image(img.options)
        .then(({ filename, image }) => {
            store.debugLogger(`File saved to ${filename}`);
        })
        .catch(err => {
            store.errorLogger(`~~~~ Failed to download: ${img.fileName}`);
            store.failedImages.push(img);
        });
}