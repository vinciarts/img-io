interface ImgSelectorOptions {
    acceptedTypes: string[];
    maxSize: number;
    timeout: number;
}
interface ImgSelectorOutput {
    jpg: File | null;
    url: string | null;
    base64: string | null;
}
declare class ImgSelector {
    private options;
    isProcessing: boolean;
    errMsg: string;
    output: ImgSelectorOutput;
    constructor(options?: Partial<ImgSelectorOptions>);
    select(file: File): Promise<void>;
    clear(): void;
    private validateFile;
    private processFile;
    private fileToBase64;
}
export { ImgSelector };
