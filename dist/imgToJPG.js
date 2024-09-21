"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imgToJPG = void 0;
const browser_image_compression_1 = require("browser-image-compression");
let heic2any;
if (typeof window !== 'undefined') {
    Promise.resolve().then(() => require('heic2any')).then((module) => {
        heic2any = module.default;
    })
        .catch((error) => {
        console.error('Failed to load heic2any:', error);
    });
}
// HEIC -> JPG
const convertHEICtoJPEG = (heicBlob) => __awaiter(void 0, void 0, void 0, function* () {
    if (!heic2any) {
        throw new Error('heic2any is not loaded');
    }
    const jpegBlob = yield heic2any({ blob: heicBlob, toType: 'image/jpeg' });
    const jpg = new File([jpegBlob], 'image.jpg', { type: 'image/jpeg' });
    return jpg;
});
const compressImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 900,
            useWebWorker: true,
            fileType: 'image/jpeg'
        };
        // 压缩图像
        const compressedBlob = yield (0, browser_image_compression_1.default)(file, options);
        // 创建新的 File 对象
        const jpg = new File([compressedBlob], file.name, {
            type: compressedBlob.type,
            lastModified: Date.now()
        });
        // 创建预览 URL
        const previewUrl = URL.createObjectURL(compressedBlob);
        return { previewUrl, jpg };
    }
    catch (error) {
        console.error('Compression error:', error);
        throw error;
    }
});
// final
const imgToJPG = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (file.type === 'image/heic' || file.type === 'image/heif') {
            return yield compressImage(yield convertHEICtoJPEG(file));
        }
        else {
            return yield compressImage(file);
        }
    }
    catch (error) {
        console.error('Error in imgToJPG:', error);
        throw error;
    }
});
exports.imgToJPG = imgToJPG;
