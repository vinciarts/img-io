import imageCompression from "browser-image-compression";

type HeicConvert = (options: { blob: Blob; toType: string }) => Promise<Blob>;
let heic2any: HeicConvert | undefined | any;

if (typeof window !== "undefined") {
  import("heic2any")
    .then((module) => {
      heic2any = module.default;
    })
    .catch((error) => {
      console.error("Failed to load heic2any:", error);
    });
}

// HEIC -> JPG
const convertHEICtoJPEG = async (heicBlob: Blob): Promise<File> => {
  if (!heic2any) {
    throw new Error("heic2any is not loaded");
  }
  const jpegBlob: Blob = await heic2any({ blob: heicBlob, toType: "image/jpeg" });
  const jpg: File = new File([jpegBlob], "image.jpg", { type: "image/jpeg" });
  return jpg;
};

// COMPRESS
interface ImgProcessorResult {
  previewUrl: string;
  jpg: File;
}

interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType: string;
}

const defaultOptions: CompressionOptions = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 900,
  useWebWorker: true,
  fileType: "image/jpeg",
};

const compressImage = async (file: File, customOptions?: Partial<CompressionOptions>): Promise<ImgProcessorResult> => {
  try {
    const options = { ...defaultOptions, ...customOptions };

    // 压缩图像
    const compressedBlob: Blob = await imageCompression(file, options);

    // 创建新的 File 对象
    const jpg: File = new File([compressedBlob], file.name, {
      type: compressedBlob.type,
      lastModified: Date.now(),
    });

    // 创建预览 URL
    const previewUrl: string = URL.createObjectURL(compressedBlob);

    return { previewUrl, jpg };
  } catch (error) {
    console.error("Compression error:", error);
    throw error;
  }
};

// final
export const imgToJPG = async (
  file: File,
  customOptions?: Partial<CompressionOptions>
): Promise<ImgProcessorResult> => {
  try {
    if (file.type === "image/heic" || file.type === "image/heif") {
      return await compressImage(await convertHEICtoJPEG(file), customOptions);
    } else {
      return await compressImage(file, customOptions);
    }
  } catch (error) {
    console.error("Error in imgToJPG:", error);
    throw error;
  }
};
