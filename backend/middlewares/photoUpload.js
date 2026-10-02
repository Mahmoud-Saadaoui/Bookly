const multer = require('multer');
const HttpError = require('../utils/httpError');

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
]);

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    return callback(null, true);
  }

  return callback(new HttpError('Only JPEG, PNG, GIF and WebP images are allowed', 400, 'INVALID_IMAGE_TYPE'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 10,
    parts: 12
  }
});

const detectImageMimeType = (buffer) => {
  if (!buffer || buffer.length < 12) {
    return null;
  }

  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    return 'image/jpeg';
  }

  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'image/png';
  }

  const header = buffer.subarray(0, 12).toString('ascii');
  if (header.startsWith('GIF87a') || header.startsWith('GIF89a')) {
    return 'image/gif';
  }

  if (header.startsWith('RIFF') && header.slice(8, 12) === 'WEBP') {
    return 'image/webp';
  }

  return null;
};

const validateUploadedImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const detectedMimeType = detectImageMimeType(req.file.buffer);
  if (!detectedMimeType || detectedMimeType !== req.file.mimetype) {
    return next(new HttpError('Uploaded file content is not a supported image', 400, 'INVALID_IMAGE_CONTENT'));
  }

  return next();
};

module.exports = {
  upload,
  validateUploadedImage
};
