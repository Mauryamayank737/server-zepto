import { CartProductModel } from "../model/cartProduct.model.js";
import UserModel from "../model/User.model.js";

export const addToCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;
    const quantity = 1;

    if (!productId) {
      return res.status(400).json({
        message: "Please provide Product ID",
        error: true,
        success: false,
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await CartProductModel.findOne({
      userId,
      productId,
    });

    if (existingCartItem) {
      // If item exists, increment quantity
      const updatedCartItem = await CartProductModel.findOneAndUpdate(
        { _id: existingCartItem._id },
        { $inc: { quantity: 1 } }, // Use $inc to increment
        { new: true } // Return the updated document
      );

      return res.status(200).json({
        data: updatedCartItem,
        message: "Cart item quantity updated",
        error: false,
        success: true,
      });
    }

    // If item doesn't exist, create new cart item
    const newCartItem = new CartProductModel({
      userId,
      productId,
      quantity,
    });

    const savedCartItem = await newCartItem.save();

    // Update user's shopping cart
    await UserModel.updateOne(
      { _id: userId },
      { $addToSet: { shopping_cart: productId } }
    );

    return res.status(200).json({
      data: savedCartItem,
      message: "Item added to cart successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Add to cart error:", error); // Better error logging
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

export const getCartItem = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await CartProductModel.find({ userId }).populate("productId");
    if (!cart) {
      return res.status(404).json({
        message: "product not found",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "cart Item",
      error: false,
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const decCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    if (!productId) {
      return res.status(400).json({
        message: "Please provide Product ID",
        error: true,
        success: false,
      });
    }

    const existingCartItem = await CartProductModel.findOne({
      userId,
      productId,
    });

    if (!existingCartItem) {
      return res.status(404).json({
        message: "Item not found in cart",
        error: true,
        success: false,
      });
    }

    await CartProductModel.findByIdAndDelete(existingCartItem._id);

    await UserModel.findByIdAndUpdate(userId, {
      $pull: { shopping_cart: productId },
    });

    return res.status(200).json({
      data: null,
      message: "Item removed from cart",
      error: false,
      success: true,
    });
    
  } catch (error) {
    console.error("Decrement cart item error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

export const deleteOneCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        error: true,
        success: false,
      });
    }

    // Check if item exists in cart before deleting
    const cartItem = await CartProductModel.findOne({
      userId,
      productId,
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Item not found in cart",
        error: true,
        success: false,
      });
    }

    // Remove item from cart
    const deletedItem = await CartProductModel.findOneAndDelete({
      userId,
      productId,
    });

    // Update user's shopping cart array
    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { shopping_cart: productId } },
      { new: true }
    );

    return res.status(200).json({
      data: {
        deletedItemId: deletedItem._id,
        productId: deletedItem.productId,
      },
      message: "Item removed from cart successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("DeleteOne cart item error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};
