import { v2 as cloudinary } from "cloudinary";

export const uploadImageClodinary = async (image) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  const uploadResult = await cloudinary.uploader
       .upload(
        image.path
       )
  // })
  
  return uploadResult;
};
