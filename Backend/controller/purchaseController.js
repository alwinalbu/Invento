// const Purchase = require("../models/purchase");
// const purchaseStock = require("./purchaseStock");

// // Add Purchase Details
// const addPurchase = (req, res) => {
//   const addPurchaseDetails = new Purchase({
//     userID: req.body.userID,
//     ProductID: req.body.productID,
//     QuantityPurchased: req.body.quantityPurchased,
//     PurchaseDate: req.body.purchaseDate,
//     TotalPurchaseAmount: req.body.totalPurchaseAmount,
//   });

//   addPurchaseDetails
//     .save()
//     .then((result) => {
//       purchaseStock(req.body.productID, req.body.quantityPurchased)
//         .then(() => {
//           res.status(200).send(result); // Return the result after stock update
//         })
//         .catch((err) => {
//           res.status(500).send({ error: "Error updating stock" });
//         });
//     })
//     .catch((err) => {
//       res.status(500).send({ error: "Error saving purchase data" }); // Server error
//     });
// };

// // Get All Purchase Data
// const getPurchaseData = async (req, res) => {
//   try {
//     const findAllPurchaseData = await Purchase.find({ "userID": req.params.userID })
//       .sort({ _id: -1 }) 
//       .populate("ProductID"); 

//     res.json(findAllPurchaseData);
//   } catch (err) {
//     res.status(500).send({ error: "Error fetching purchase data" });
//   }
// };

// // Get total purchase amount
// const getTotalPurchaseAmount = async (req, res) => {
//   try {
//     let totalPurchaseAmount = 0;
//     const purchaseData = await Purchase.find({ "userID": req.params.userID });

//     purchaseData.forEach((purchase) => {
//       totalPurchaseAmount += purchase.TotalPurchaseAmount;
//     });

//     res.json({ totalPurchaseAmount });
//   } catch (err) {
//     res.status(500).send({ error: "Error calculating total purchase amount" });
//   }
// };

// module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount };


const Purchase = require("../models/purchase");
const Sales = require("../models/sales");
const purchaseStock = require("./purchaseStock");

// ✅ Add Purchase Details
const addPurchase = (req, res) => {
  const addPurchaseDetails = new Purchase({
    userID: req.body.userID,
    supplierID: req.body.supplierID, // ✅ new line added
    ProductID: req.body.productID,
    QuantityPurchased: req.body.quantityPurchased,
    PurchaseDate: req.body.purchaseDate,
    TotalPurchaseAmount: req.body.totalPurchaseAmount,
  });

  addPurchaseDetails
    .save()
    .then((result) => {
      // ✅ Update product stock after purchase
      purchaseStock(req.body.productID, req.body.quantityPurchased)
        .then(() => {
          res.status(200).send(result);
        })
        .catch((err) => {
          console.error("Error updating stock:", err);
          res.status(500).send({ error: "Error updating stock" });
        });
    })
    .catch((err) => {
      console.error("Error saving purchase:", err);
      res.status(500).send({ error: "Error saving purchase data" });
    });
};

// ✅ Get All Purchase Data
const getPurchaseData = async (req, res) => {
  try {
    const findAllPurchaseData = await Purchase.find({
      userID: req.params.userID,
    })
      .sort({ _id: -1 })
      .populate("ProductID")
      .populate("supplierID"); // ✅ populate supplier info too

    res.json(findAllPurchaseData);
  } catch (err) {
    console.error("Error fetching purchases:", err);
    res.status(500).send({ error: "Error fetching purchase data" });
  }
};

// ✅ Get Total Purchase Amount
const getTotalPurchaseAmount = async (req, res) => {
  try {
    const purchaseData = await Purchase.find({
      userID: req.params.userID,
    });

    const totalPurchaseAmount = purchaseData.reduce(
      (sum, purchase) => sum + (purchase.TotalPurchaseAmount || 0),
      0
    );

    res.json({ totalPurchaseAmount });
  } catch (err) {
    console.error("Error calculating total:", err);
    res.status(500).send({ error: "Error calculating total purchase amount" });
  }
};

// ✅ Edit existing Purchase
const editPurchase = async (req, res) => {
  try {
    const { purchaseID } = req.params;
    const updatedData = req.body;

    // Fetch the old purchase first
    const oldPurchase = await Purchase.findById(purchaseID);
    if (!oldPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    
    // (Handled in frontend by /sales/check route, but double-check here)
    const salesAfterPurchase = await Sales.find({
      ProductID: oldPurchase.ProductID,
      SaleDate: { $gte: oldPurchase.PurchaseDate },
    });

    console.log(salesAfterPurchase,"backedn check wether sales is there or not ");
    

    // If sales exist, lock quantity/amount changes
    if (salesAfterPurchase.length > 0) {
      if (
        updatedData.quantityPurchased !== oldPurchase.QuantityPurchased ||
        updatedData.totalPurchaseAmount !== oldPurchase.TotalPurchaseAmount
      ) {
        return res.status(400).json({
          message:
            "Cannot modify Quantity or Amount — sales exist for this product.",
        });
      }
    }

    // ✅ Update purchase fields
    oldPurchase.SupplierID = updatedData.supplierID || oldPurchase.SupplierID;
    oldPurchase.QuantityPurchased =
      updatedData.quantityPurchased || oldPurchase.QuantityPurchased;
    oldPurchase.TotalPurchaseAmount =
      updatedData.totalPurchaseAmount || oldPurchase.TotalPurchaseAmount;
    oldPurchase.PurchaseDate =
      updatedData.purchaseDate || oldPurchase.PurchaseDate;

    await oldPurchase.save();

    console.log(oldPurchase,"purchase edit from bacekdn");
    

    res.json({ message: "Purchase updated successfully", oldPurchase });
  } catch (error) {
    console.error("Error editing purchase:", error);
    res.status(500).json({ message: "Server error while editing purchase" });
  }
};

module.exports = {
  addPurchase,
  getPurchaseData,
  getTotalPurchaseAmount,
  editPurchase,
};

