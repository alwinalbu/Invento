const express = require("express");
const { addProduct, getAllProducts, deleteSelectedProduct, updateSelectedProduct, searchProduct, restoreProduct, fetchInStockProducts } = require("../controller/productController");
const router = express.Router();


// Add Product
router.post("/add",addProduct);

// Get All Products
router.get("/get/:userId", getAllProducts);

// Delete Selected Product Item
router.put("/delete/:id", deleteSelectedProduct);

router.put('/restore/:id', restoreProduct);

// Update Selected Product
router.post("/update", updateSelectedProduct);

// Search Product
router.get("/search",searchProduct);

// Define the route in your backend
router.get('/in-stock/:userId', fetchInStockProducts);



module.exports = router;
