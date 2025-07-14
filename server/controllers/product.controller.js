import { error } from "console";
import { ProductModel } from "../model/product.model.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      images,
      category,
      subCategory,
      unit,
      stock,
      originalPrice,
      currentPrice,
      description,
      more_details,
    } = req.body;

    if (
      !name ||
      !images?.[0] ||
      !category?.[0] ||
      !subCategory?.[0] ||
      !unit ||
      !stock ||
      !originalPrice ||
      !currentPrice ||
      !description
    ) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    const newProduct = new ProductModel({
      name,
      image: images,
      category,
      subCategory,
      unit,
      stock,
      originalPrice,
      currentPrice,
      description,
      more_details,
    });
    const savedProduct = await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      error: false,
      success: true,
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
export const list = async (req, res) => {
  try {
    const { createdAt, name, currentPrice, order = -1 } = req.body;

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    let sortBy = "createdAt";

    if (currentPrice) {
      sortBy = "currentPrice";
    } else if (name) {
      sortBy = "name";
    } else if (createdAt) {
      sortBy = "createdAt";
    }

    // Get total count of products
    const totalProducts = await ProductModel.countDocuments();
    // console.log(totalProducts)
    const totalPages = Math.ceil(totalProducts / limit);

    const query = ProductModel.find();

    // Add collation only when sorting by name (string field)
    if (sortBy === "name") {
      query.collation({ locale: "en", strength: 2 });
    }

    const response = await query.sort({ [sortBy]: order }).skip(skip).limit(limit);

    return res.status(200).json({
      message: "Sorted data",
      success: true,
      error: false,
      data: response,
      totalProducts,
      totalPages,
      currentPage: page,
      limit
    });
  } catch (error) {
    console.log("Product Data List Error", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// export const getProduct = async (req, res) => {
//   try {
//     const data = await ProductModel.find()
//       .sort({ createdAt: -1 })
//       .populate("subCategory category");

//     return res.status(200).json({
//       data: data,
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error get product:", error);
//     return res.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };

export const deletPorduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const DelteProduct = await ProductModel.findByIdAndDelete({
      _id: productId,
    });

    return res.status(200).json({
      message: "Delete Product",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error get product:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const UpdateProduct = async (req, res) => {
  try {
    const {
      _id,
      name,
      images,
      category,
      subCategory,
      unit,
      stock,
      originalPrice,
      currentPrice,
      description,
      more_details,
    } = req.body;

    const checkProduct = await ProductModel.findByIdAndUpdate(
      _id,
      {
        name,
        images,
        category,
        subCategory,
        unit,
        stock,
        originalPrice,
        currentPrice,
        description,
        more_details,
      },
      { new: true }
    );
    console.log(checkProduct);

    if (!checkProduct) {
      return res.status(400).json({
        message: "Product not present",
        success: false,
        error: true,
      });
    }
    return res.status(200).json({
      message: "Productupdated",
      success: true,
      error: false,
      body: checkProduct,
    });
  } catch (error) {
    console.error("Error update product:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const filtterProduct = async (req, res) => {
  try {
    const { sort = {}, ...filters } = req.body;

    // Prepare filters (support partial match for name)
    const query = { ...filters };

    if (filters.name) {
      query.name = { $regex: filters.name, $options: "i" }; // case-insensitive partial match
    }

    // Sanitize sort fields
    const validSortFields = ["currentPrice", "createdAt", "name"];
    const sortOptions = {};

    for (let key of validSortFields) {
      if (sort[key] === 1 || sort[key] === -1) {
        sortOptions[key] = sort[key];
      }
    }

    const data = await ProductModel.find(query).sort(sortOptions);

    return res.status(200).json({
      message: "Filtered and sorted product list",
      data,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error in filtterProduct:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const view = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ProductModel.findById(id).populate(
      "subCategory category"
    );
    if (!response) {
      console.log("This ID Product not found");
      return res.status(404).json({
        message: "This ID Product not found",
        success: false,
        error: true,
      });
    } else {
      return res.status(200).json({
        message: "View Product",
        success: true,
        error: false,
        data: response,
      });
    }

    // console.log(response);
  } catch (error) {
    console.log("Product View Error", error.message || error);
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }

    // Find products where any category in the array matches the ID
    const products = await ProductModel.find({"category" :{$in :id}}).populate("category subCategory")

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category"
      });
    }

    res.status(200).json({
      success: true,
      data:products
    });

  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: error.message
    });
  }
};


export const getProductBySubcategory =  async (req, res) => {
  try {
const { id } = req.body;

    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Subcategory ID is required",
        data: null
      });
    }

    // Build query with published products only
    const query = {
      subCategory: { $in: Array.isArray(id) ? id : [id] },
      publish: true // Only fetch published products
    };

    // Find products with population
    const products = await ProductModel.find(query).populate("category subCategory")

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this subcategory"
      });
    }

    res.status(200).json({
      success: true,
      data:products
    });

  } catch (error) {
    console.error("Error fetching products by subcategory:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: error.message
    });
  }
};



