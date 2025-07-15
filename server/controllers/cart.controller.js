import { CartProductModel } from "../model/cartProduct.model.js"

export const createCart = async (req, res) => {
  try {
    const { productId, userId, quantity = 1 } = req.body;

    // Validate input
    if (!productId || !userId) {
      return res.status(400).json({  
        message: "Both productId and userId are required",
        success: false
      });
    }

    // Check if product already exists in user's cart
    const existingCartItem = await CartProductModel.findOne({ 
      productId, 
      userId 
    }).populate({
        path: 'productId',
        select: 'name _id image'  // Fields to select from Product
      })
      .populate({
        path: 'userId',
        select: 'name _id '  // Fields to select from User
      });;

    if (existingCartItem) {
      return res.status(409).json({  
        message: "Product already exists in cart",
        success: false,
        existingItem: existingCartItem
      });
    }

    // Create new cart item
    const newCartItem = await CartProductModel.create({
      productId,
      userId,
      quantity
    });

    // Populate with specific fields
    const populatedCartItem = await CartProductModel
      .findById(newCartItem._id)
      .populate({
        path: 'productId',
        select: 'name _id  images'  // Fields to select from Product
      })
      .populate({
        path: 'userId',
        select: 'name _id image'  // Fields to select from User
      });

    return res.status(201).json({  
      message: "Product added to cart successfully",
      success: true,
      data: populatedCartItem
    });

  } catch (error) {
    console.error("Cart Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
};