const express = require("express");
const { addPurchase, getPurchaseData, getTotalPurchaseAmount } = require("../controller/purchaseController");
const router = express.Router();


// Add Purchase
router.post("/add", addPurchase);

// Get All Purchase Data
router.get("/get/:userID", getPurchaseData);

router.get("/get/:userID/totalpurchaseamount",getTotalPurchaseAmount);

module.exports = router;


