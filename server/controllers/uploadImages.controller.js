import { uploadImageClodinary } from "../utils/uploadImageCloudinary.js";

export const uploadImageController = async (req, res) => {
  try {
    const file = req.file;
    console.log(file);

    const uploadImage = await uploadImageClodinary(file)
    return res.json({
      message: "image upload",
      data:uploadImage
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
