const Product = require("../models/Product");

// ─────────────────────────────────────────────────────────────
//  GET /api/products
//  Query params: name, category, minPrice, maxPrice, isActive,
//                isFeatured, status, page, limit, sort
// ─────────────────────────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const {
      name,
      category,
      minPrice,
      maxPrice,
      isActive,
      isFeatured,
      isBestSeller,
      isOnSale,
      status,
      brand,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    // Build filter object dynamically
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // case-insensitive search
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true";
    }
    if (isBestSeller !== undefined) {
      filter.isBestSeller = isBestSeller === "true";
    }
    if (isOnSale !== undefined) {
      filter.isOnSale = isOnSale === "true";
    }
    if (status) {
      filter.status = status;
    }
    if (brand) {
      filter.brand = { $regex: brand, $options: "i" };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit)); // max 50 per page
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [products, totalCount] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      count: products.length,
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      filters: filter,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET /api/products/:id
// ─────────────────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID "${req.params.id}" not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    // Invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid product ID format: "${req.params.id}"`,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  POST /api/products
// ─────────────────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: `Product "${savedProduct.name}" created successfully!`,
      data: savedProduct,
    });
  } catch (error) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    // Duplicate key (slug / SKU)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `A product with this ${field} already exists`,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  PUT /api/products/:id  — Full Replace
// ─────────────────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID "${req.params.id}" not found`,
      });
    }

    // Replace all fields (PUT semantics — send complete object)
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, overwrite: true }
    );

    res.status(200).json({
      success: true,
      message: `Product "${updatedProduct.name}" fully updated successfully!`,
      data: updatedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid product ID format: "${req.params.id}"`,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  PATCH /api/products/:id  — Partial Update
// ─────────────────────────────────────────────────────────────
const patchProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID "${req.params.id}" not found`,
      });
    }

    // Only update provided fields (PATCH semantics)
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `Product "${updatedProduct.name}" partially updated!`,
      updatedFields: Object.keys(req.body),
      data: updatedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid product ID format: "${req.params.id}"`,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to patch product",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  DELETE /api/products/:id
// ─────────────────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID "${req.params.id}" not found`,
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Product "${product.name}" deleted successfully!`,
      deletedProduct: {
        id: product._id,
        name: product.name,
        category: product.category,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid product ID format: "${req.params.id}"`,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
};
