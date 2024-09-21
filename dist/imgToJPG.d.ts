interface ImgProcessorResult {
    previewUrl: string;
    jpg: File;
}
export declare const imgToJPG: (file: File) => Promise<ImgProcessorResult>;
export {};
