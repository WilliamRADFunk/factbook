export interface ImageScrapableObject {
    fileName: string;
    options: {
        url: string;
        dest: string;
        timeout: number;
    };
}