import categoryModel from "../model/category.model.js";
import { subcategoryModel } from "../model/subcategory.model.js";
import { ProductModel } from "../model/product.model.js";

export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    const payload = {
      name,
      image,
    };

    const addcategory = new categoryModel(payload);
    const saveCategory = await addcategory.save();

    if (!saveCategory) {
      return res.status(500).json({
        message: "Category Not created",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Add Category",
      error: false,
      success: true,
      data: saveCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getCategoryController = async (req, res) => {
  try {
    const data = await categoryModel.find().sort({ createdAt: -1 });
    return res.status(200).json({
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const UpdateCategoryController = async (req, res) => {
  try {
    const { categoryId, name, image } = req.body;
    const data = await categoryModel.findByIdAndUpdate(
      { _id: categoryId },
      {
        name,
        image,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Category Updated",
      error: false,
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const DeleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const checkSubCategory = await subcategoryModel
      .find({
        category: {
          $in: [{ _id: categoryId }],
        },
      })
      .countDocuments();

    const checkProduct = await ProductModel.find({
      category: {
        $in: [{ _id: categoryId }],
      },
    }).countDocuments();

    if (checkProduct > 0 || checkSubCategory > 0) {
      return res.status(400).json({
        message: "Category is already use can't deleted",
        error: true,
        success: false,
      });
    }

    const deleteCategory = await categoryModel.findByIdAndDelete({
      _id: categoryId,
    });
    return res.status(200).json({
      message: "Delete Category",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
