const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // ── Basic Info ───────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },

    // ── Pricing ──────────────────────────────────────────────
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // ── Category & Tags ──────────────────────────────────────
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Electronics", "Clothing", "Food", "Books", "Sports", "Home", "Beauty", "Toys"],
        message: "{VALUE} is not a valid category",
      },
    },
    subCategory: { type: String, default: "" },
    tags: { type: [String], default: [] },
    brand: { type: String, default: "Generic" },

    // ── Stock & Inventory ────────────────────────────────────
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sku: { type: String, unique: true },
    weight: { type: Number, default: 0 }, // in kg

    // ── Media ────────────────────────────────────────────────
    image: { type: String, default: "" },
    images: { type: [String], default: [] },

    // ── Ratings ──────────────────────────────────────────────
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: { type: Number, default: 0 },

    // ── Conditional Rendering Flags ──────────────────────────
    isActive: { type: Boolean, default: true },        // show/hide product
    isFeatured: { type: Boolean, default: false },     // featured badge
    isNewArrival: { type: Boolean, default: false },   // "NEW" badge
    isBestSeller: { type: Boolean, default: false },   // best seller badge
    isOnSale: { type: Boolean, default: false },       // sale badge
    inStock: { type: Boolean, default: true },         // add to cart button
    freeShipping: { type: Boolean, default: false },   // free shipping badge
    isPremium: { type: Boolean, default: false },      // premium icon

    // ── Shipping Info ────────────────────────────────────────
    shippingDays: { type: Number, default: 5 },
    returnDays: { type: Number, default: 7 },

    // ── Status ───────────────────────────────────────────────
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual: discounted price ────────────────────────────────
productSchema.virtual("finalPrice").get(function () {
  if (this.discount > 0) {
    return +(this.price - (this.price * this.discount) / 100).toFixed(2);
  }
  return this.price;
});

// ── Pre-save: auto-generate slug & SKU ──────────────────────
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  if (!this.sku) {
    this.sku = "SKU-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
