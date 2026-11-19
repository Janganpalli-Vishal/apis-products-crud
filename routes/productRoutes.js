const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
} = require("../controllers/productController");

// ─── Route Summary ─────────────────────────────────────────────────────────
// GET    /api/products            → get all (with filters + pagination)
// GET    /api/products/:id        → get one
// POST   /api/products            → create new
// PUT    /api/products/:id        → full replace
// PATCH  /api/products/:id        → partial update
// DELETE /api/products/:id        → delete
// ───────────────────────────────────────────────────────────────────────────

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.patch("/:id", patchProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
