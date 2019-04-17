import { store } from "../constants/globalStore";
import { downloadImage } from "./download-image";

export function downloadImages(): Array<Promise<any>> {
    const imagePromises: Array<Promise<any>> = [];
    const images = store.IMAGES_TO_SCRAPE.slice();
    images.forEach(img => {
        imagePromises.push(downloadImage(img));
    });
    return imagePromises;
};