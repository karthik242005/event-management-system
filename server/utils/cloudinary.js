// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dpxh5j558',
  api_key: '175285945212991',
  api_secret: 'wf4VECSGl183IGSwFXPR4L1bY7g'
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'event_photos',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

export { cloudinary, storage };
