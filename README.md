# img-io

img-io is a lightweight JavaScript library for image processing, specifically designed for image compression and format conversion in browser environments.

## Features

- Image compression
- Supports .HEIC (moderm phone photo fromat) to JPEG conversion automatically
- Simple and easy-to-use API

## Installation

As img-io is not currently published on npm, you need to install it directly from GitHub.

### Using Yarn

npm install git+https://github.com/vinciarts/img-io.git

import { ImgSelector } from 'img-io';

## API Documentation

### ImgSelector

#### Constructor Options

- `acceptedTypes`: Array of accepted image types
- `maxSize`: Maximum file size in bytes
- `timeout`: Processing timeout in milliseconds

#### Methods

- `select(file: File): Promise<void>`: Process the selected file
- `clear(): void`: Clear the current processing result

#### Properties

- `output`: Object containing the processing result
  - `jpg`: Processed JPEG file
  - `url`: Preview URL of the processed image

## Contributing

Issues and pull requests are welcome to help improve this project.

## License

[MIT License](LICENSE)
