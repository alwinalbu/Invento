const Purchase = require("../models/Purchase");
const purchaseStock = require("./purchaseStock");

// Add Purchase Details
const addPurchase = (req, res) => {
  const addPurchaseDetails = new Purchase({
    userID: req.body.userID,
    ProductID: req.body.productID,
    QuantityPurchased: req.body.quantityPurchased,
    PurchaseDate: req.body.purchaseDate,
    TotalPurchaseAmount: req.body.totalPurchaseAmount,
  });

  addPurchaseDetails
    .save()
    .then((result) => {
      purchaseStock(req.body.productID, req.body.quantityPurchased)
        .then(() => {
          res.status(200).send(result); // Return the result after stock update
        })
        .catch((err) => {
          res.status(500).send({ error: "Error updating stock" });
        });
    })
    .catch((err) => {
      res.status(500).send({ error: "Error saving purchase data" }); // Server error
    });
};

// Get All Purchase Data
const getPurchaseData = async (req, res) => {
  try {
    const findAllPurchaseData = await Purchase.find({ "userID": req.params.userID })
      .sort({ _id: -1 }) // -1 for descending order
      .populate("ProductID"); // Populate ProductID field with product details

    res.json(findAllPurchaseData);
  } catch (err) {
    res.status(500).send({ error: "Error fetching purchase data" });
  }
};

// Get total purchase amount
const getTotalPurchaseAmount = async (req, res) => {
  try {
    let totalPurchaseAmount = 0;
    const purchaseData = await Purchase.find({ "userID": req.params.userID });

    purchaseData.forEach((purchase) => {
      totalPurchaseAmount += purchase.TotalPurchaseAmount;
    });

    res.json({ totalPurchaseAmount });
  } catch (err) {
    res.status(500).send({ error: "Error calculating total purchase amount" });
  }
};

module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount };
