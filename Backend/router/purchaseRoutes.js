const express = require("express");
const { addPurchase, getPurchaseData, getTotalPurchaseAmount, editPurchase } = require("../controller/purchaseController");
const router = express.Router();


// Add Purchase
router.post("/add", addPurchase);

// Get All Purchase Data
router.get("/get/:userID", getPurchaseData);

router.get("/get/:userID/totalpurchaseamount",getTotalPurchaseAmount);

// ✅ Edit a purchase
router.put("/edit/:purchaseID", editPurchase);


module.exports = router;


