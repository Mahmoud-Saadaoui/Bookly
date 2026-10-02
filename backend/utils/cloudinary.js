const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const logger = require('./logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryUploadImage = (buffer) => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    { resource_type: 'image' },
    (error, result) => error ? reject(error) : resolve(result)
  );

  Readable.from([buffer]).pipe(uploadStream);
});

const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    return await cloudinary.uploader.destroy(imagePublicId);
  } catch (error) {
    logger.error('Cloudinary image deletion failed', { message: error.message });
    throw new Error('Cloudinary image deletion failed');
  }
};

module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage
};
