import { store } from "../constants/globalStore";
import { downloadImages } from "./download-images";

export function getImages() {
    const promises = downloadImages();
    Promise.all(promises)
        .then(() => {
            if (store.failedImages.length) {
                store.debugLogger('Images that failed download: [');
                store.failedImages.forEach(c => {
                    store.debugLogger(c.fileName);
                });
                store.debugLogger(']');
                store.IMAGES_TO_SCRAPE = store.failedImages.slice();
                store.failedImages.length = 0;
                getImages();
            } else {
                process.exit(0);
            }
        })
        .catch(err => {
            // store.LOG_STREAM.error(new Date().toISOString() + '\n\n' + err.toString() + '\n\n');
        });
};