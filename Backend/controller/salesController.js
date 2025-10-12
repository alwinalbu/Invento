const { default: mongoose } = require("mongoose");
const soldStock = require("./soldStock");
const Joi = require("joi");
const Sales = require("../models/sales");

// Utility function for calculating sales amount
const calculateSalesAmount = (sales, groupByMonth = false) => {
  if (groupByMonth) {
    const monthlySales = Array.from({ length: 12 }, () => 0);
    sales.forEach((sale) => {
      const monthIndex = new Date(sale.SaleDate).getMonth();
      monthlySales[monthIndex] += sale.TotalSaleAmount;
    });
    return monthlySales;
  }

  return sales.reduce((total, sale) => total + sale.TotalSaleAmount, 0);
};

// Joi schema for sales validation
const salesSchema = Joi.object({
  userID: Joi.string().required(),
  productID: Joi.string().required(),
  storeID: Joi.string().required(),
  stockSold: Joi.number().min(0).required(),
  saleDate: Joi.date().iso().required(),
  totalSaleAmount: Joi.number().min(0).required(),
});

// Add Sales
const addSales = async (req, res) => {
  const { error } = salesSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const addSale = new Sales({
    userID: req.body.userID,
    ProductID: req.body.productID,
    StoreID: req.body.storeID,
    StockSold: req.body.stockSold,
    SaleDate: req.body.saleDate,
    TotalSaleAmount: req.body.totalSaleAmount,
  });

  try {
    const result = await addSale.save();
    await soldStock(req.body.productID, req.body.stockSold); // Ensure async execution
    res.status(200).json(result);
  } catch (err) {
    console.error("Error adding sales:", err);
    res.status(500).json({ error: "Failed to add sales" });
  }
};



// Get All Sales Data
const getSalesData = async (req, res) => {
  try {
    const findAllSalesData = await Sales.find({ userID: req.params.userID })
      .sort({ _id: -1 })
      .populate("ProductID")
      .populate("StoreID");

      console.log(findAllSalesData,"all sales data");
      
    res.status(200).json(findAllSalesData);
  } catch (err) {
    console.error("Error fetching sales data:", err);
    res.status(500).json({ error: "Failed to retrieve sales data" });
  }
};

// Get Total Sales Amount
const getTotalSalesAmount = async (req, res) => {
  try {
    const sales = await Sales.find({ userID: req.params.userID });
    const totalSaleAmount = calculateSalesAmount(sales);
    res.status(200).json({ totalSaleAmount });
  } catch (err) {
    console.error("Error fetching total sales amount:", err);
    res.status(500).json({ error: "Failed to retrieve total sales amount" });
  }
};

// Get Sales Items 
const getItemsSold = async (req, res) => {
  const { userID } = req.params;

  try {
    // Find all sales by the user and populate product details
    const salesData = await Sales.aggregate([
      { $match: { userID: new mongoose.Types.ObjectId(userID) } },
      {
        $lookup: {
          from: "products", // Name of the products collection
          localField: "ProductID",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, // Flatten the productDetails array
      {
        $group: {
          _id: "$ProductID",
          name: { $first: "$productDetails.name" },
          quantitySold: { $sum: "$StockSold" },
        },
      },
    ]);

    res.status(200).json(salesData);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ error: "An error occurred while fetching sales data." });
  }
};

// Get Monthly Sales
const getMonthlySales = async (req, res) => {
  try { 
    const sales = await Sales.find({ userID: req.params.userID }); 
    const salesAmount = calculateSalesAmount(sales, true); 
    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error("Error fetching monthly sales:", err);
    res.status(500).json({ error: "Failed to retrieve monthly sales" });
  }
};

// ✅ Check if a product has any sales after purchase date
const checkProductSales = async (req, res) => {
  try {
    const { productID, purchaseDate } = req.params;

    console.log("🔍 Product ID:", productID);
    console.log("🗓️ Purchase Date:", purchaseDate);

    // Convert properly
    const purchaseDateObj = new Date(purchaseDate);

    // Ensure valid date
    if (isNaN(purchaseDateObj)) {
      return res.status(400).json({ message: "Invalid purchase date" });
    }

    // Query safely
    const sales = await Sales.find({
      ProductID: productID,
      $expr: {
        $gte: [
          { $dateFromString: { dateString: "$SaleDate" } },
          purchaseDateObj
        ]
      }
    });

    console.log(`🧾 Sales found: ${sales.length}`);
    res.json({ hasSales: sales.length > 0 });
  } catch (error) {
    console.error("❌ Error checking product sales:", error);
    res.status(500).json({ message: "Server error while checking sales" });
  }
};

module.exports = { addSales, getSalesData, getTotalSalesAmount, getMonthlySales ,getItemsSold,checkProductSales };

