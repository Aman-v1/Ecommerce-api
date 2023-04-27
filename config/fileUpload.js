import cloudinaryPackage from 'cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
dotenv.config();
const cloudinary = cloudinaryPackage.v2;

//configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});
//create storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png', 'jepg'],
  params: {
    folder: 'Ecommerce-api',
  },
});

//Init multer with storage engine
const upload = multer({
  storage,
});

export default upload;
