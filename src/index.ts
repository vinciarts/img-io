import { imgToJPG } from "./imgToJPG";

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

class ImgIO {
  private options: ImgSelectorOptions;
  public isProcessing: boolean = false;
  public errMsg: string = "";
  public output: ImgSelectorOutput = { jpg: null, url: null, base64: null };

  constructor(options: Partial<ImgSelectorOptions> = {}) {
    this.options = {
      acceptedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/heic", "image/heif", "image/tiff"],
      maxSize: 5 * 1024 * 1024, // 默认5MB
      timeout: 8000, // 默认8秒
      ...options,
    };
  }

  async select(file: File): Promise<void> {
    this.isProcessing = true;
    this.errMsg = "";
    this.clear();

    try {
      if (!this.validateFile(file)) {
        throw new Error("Invalid file type or size");
      }

      const result = await this.processFile(file);
      this.output.jpg = result.jpg;
      this.output.url = result.previewUrl;
      this.output.base64 = await this.fileToBase64(result.jpg);
    } catch (error) {
      if (error instanceof Error) {
        this.errMsg = error.message;
        console.error("Error processing file:", error.message);
      } else {
        this.errMsg = "An unknown error occurred";
        console.error("Unknown error processing file:", error);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  clear(): void {
    this.output = { jpg: null, url: null, base64: null };
    this.errMsg = "";
  }

  private validateFile(file: File): boolean {
    return this.options.acceptedTypes.includes(file.type) && file.size <= this.options.maxSize;
  }

  private async processFile(file: File): Promise<{ jpg: File; previewUrl: string }> {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Processing timeout")), this.options.timeout)
    );

    const processPromise = imgToJPG(file);

    return await Promise.race([processPromise, timeoutPromise]);
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1]; // 只保留base64部分
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export { ImgIO };
