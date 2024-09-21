import { imgToJPG, CompressionOptions } from "./imgToJPG";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/heic", "image/heif", "image/tiff"];

interface ImgSelectorOptions {
  timeout: number;
  compressionOptions?: Partial<CompressionOptions>;
}

interface ImgSelectorOutput {
  jpg: File | null;
  url: string | null;
  base64: string | null;
}

class ImgIO {
  private options: ImgSelectorOptions;
  public isProcessing: boolean = false;
  public errorMessage: string = "";
  public output: ImgSelectorOutput = { jpg: null, url: null, base64: null };

  constructor(options: Partial<ImgSelectorOptions> = {}) {
    this.options = {
      timeout: 8000, // Default 8 seconds
      ...options,
    };
  }

  async select(file: File): Promise<void> {
    this.isProcessing = true;
    this.errorMessage = "";
    this.clear();

    try {
      if (!this.validateFile(file)) {
        throw new Error("Unsupported file type");
      }

      const result = await this.processFile(file);
      this.output.jpg = result.jpg;
      this.output.url = result.previewUrl;
      this.output.base64 = await this.fileToBase64(result.jpg);
    } catch (error) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
        console.error("Error processing file:", error.message);
      } else {
        this.errorMessage = "An unknown error occurred";
        console.error("An unknown error occurred while processing file:", error);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  clear(): void {
    this.output = { jpg: null, url: null, base64: null };
    this.errorMessage = "";
  }

  private validateFile(file: File): boolean {
    return ACCEPTED_TYPES.includes(file.type);
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

export default { ImgIO };
