const Product = require("../models/Product");

const purchaseStock = async (productID, purchaseStockData) => {
  try {
    const myProductData = await Product.findOne({ _id: productID });

    console.log(myProductData,"before purchase updated");
    console.log(purchaseStockData,"purchase stock");
    
  
    // Ensure the stock is a valid number before performing operations
    const myUpdatedStock = parseInt(myProductData.stock, 10) + purchaseStockData;

    console.log(myUpdatedStock,"stock updated");
    

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: productID },
      {
        stock: myUpdatedStock,
      },
      { new: true }
    );

    console.log(updatedProduct);
  } catch (error) {
    console.error("Error updating Purchase stock ", error);
    throw error; // Rethrow to be caught in the calling function
  }
};

module.exports = purchaseStock;
