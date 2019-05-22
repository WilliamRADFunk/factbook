import { store } from "../constants/globalStore";
import { downloadImages } from "./download-images";

export async function getImages(): Promise<void> {
    const promises = downloadImages();
    return await Promise.all(promises)
        .then(async () => {
            if (store.failedImages.length) {
                store.debugLogger('Images that failed download: [');
                store.failedImages.forEach(c => {
                    store.debugLogger(c.fileName);
                });
                store.debugLogger(']');
                store.IMAGES_TO_SCRAPE = store.failedImages.slice();
                store.failedImages.length = 0;
                await getImages();
            }
        })
        .catch(err => {
            store.LOG_STREAM.error(new Date().toISOString() + '\n\ngetImages\n\n' + err.toString() + '\n\n');
        });
};