const express = require("express");
const router = express.Router();
const { addSales, getSalesData, getMonthlySales, getTotalSalesAmount, getItemsSold } = require("../controller/salesController");

// Add Sales
router.post("/add",addSales);

// Get All Sales
router.get("/get/:userID",getSalesData);
router.get("/getmonthly/:userID",getMonthlySales);
router.get("/getitems/:userID",getItemsSold)

router.get("/get/:userID/totalsaleamount",getTotalSalesAmount);

module.exports = router;



