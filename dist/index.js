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
exports.ImgSelector = void 0;
const imgToJPG_1 = require("./imgToJPG");
class ImgSelector {
    constructor(options = {}) {
        this.isProcessing = false;
        this.errMsg = '';
        this.output = { jpg: null, url: null, base64: null };
        this.options = Object.assign({ acceptedTypes: [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'image/heic',
                'image/heif',
                'image/tiff'
            ], maxSize: 5 * 1024 * 1024, timeout: 8000 }, options);
    }
    select(file) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isProcessing = true;
            this.errMsg = '';
            this.clear();
            try {
                if (!this.validateFile(file)) {
                    throw new Error('Invalid file type or size');
                }
                const result = yield this.processFile(file);
                this.output.jpg = result.jpg;
                this.output.url = result.previewUrl;
                this.output.base64 = yield this.fileToBase64(result.jpg);
            }
            catch (error) {
                if (error instanceof Error) {
                    this.errMsg = error.message;
                    console.error('Error processing file:', error.message);
                }
                else {
                    this.errMsg = 'An unknown error occurred';
                    console.error('Unknown error processing file:', error);
                }
            }
            finally {
                this.isProcessing = false;
            }
        });
    }
    clear() {
        this.output = { jpg: null, url: null, base64: null };
        this.errMsg = '';
    }
    validateFile(file) {
        return this.options.acceptedTypes.includes(file.type) && file.size <= this.options.maxSize;
    }
    processFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Processing timeout')), this.options.timeout));
            const processPromise = (0, imgToJPG_1.imgToJPG)(file);
            return yield Promise.race([processPromise, timeoutPromise]);
        });
    }
    fileToBase64(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result.split(',')[1]; // 只保留base64部分
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });
    }
}
exports.ImgSelector = ImgSelector;
