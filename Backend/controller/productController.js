const Product = require("../models/Product");

// Add Product
const addProduct = async (req, res) => {
    try {
        const { userId, name, manufacturer, description } = req.body;

        // Validate input
        if (!userId || !name || !manufacturer) {
            return res.status(400).json({ message: "Required fields are missing." });
        }

        // Create new product
        const newProduct = new Product({
            userID: userId,
            name,
            manufacturer,
            stock: 0,
            description,
        });

        // Save to database
        const result = await newProduct.save();
        res.status(201).json(result);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Failed to add product." });
    }
};

// Get All Products (including deleted ones if requested)
const getAllProducts = async (req, res) => {
    try {
        const { userId } = req.params;
        const { includeDeleted } = req.query; 

        const query = { userID: userId };
        if (!includeDeleted) {
            query.deleted = false; 
        }

        const products = await Product.find(query).sort({ _id: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products." });
    }
};


// Delete Selected Product (Soft delete, update related purchases and sales)
const deleteSelectedProduct = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(id,"delete id ");
        
        const deleteProduct = await Product.updateOne(
            { _id: id },
            { $set: { deleted: true } } 
        );

        res.status(200).json({
            message: "Product marked as deleted, related purchases and sales updated.",
            deleteProduct,
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Failed to delete product." });
    }
};

// Restore (Make Active) Product
const restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;

       
        const restoreProduct = await Product.updateOne(
            { _id: id },
            { $set: { deleted: false } } 
        );

        if (!restoreProduct.nModified) {
            return res.status(404).json({ message: "Product not found or already active." });
        }

        res.status(200).json({ message: "Product restored and marked as active." });
    } catch (error) {
        console.error("Error restoring product:", error);
        res.status(500).json({ message: "Failed to restore product." });
    }
};



// Update Selected Product
const updateSelectedProduct = async (req, res) => {
    try {
        const { productID, name, manufacturer, description } = req.body;

        
        if (!productID || !name || !manufacturer) {
            return res.status(400).json({ message: "Required fields are missing." });
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            { _id: productID },
            { name, manufacturer, description },
            { new: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product." });
    }
};

// Search Products (Exclude deleted products)
const searchProduct = async (req, res) => {
    try {
        const { searchTerm } = req.query;

        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required." });
        }

        // Exclude deleted products from search results
        const products = await Product.find({
            name: { $regex: searchTerm, $options: "i" },
        });

        res.status(200).json(products);
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ message: "Failed to search products." });
    }
};

// Fetching Products that are in stock
const fetchInStockProducts = async (req, res) => {
    try {
        const { userId } = req.params;

        
        const products = await Product.find({ userID: userId, stock: { $gt: 0 }});

        console.log(products,"after fetching ");
        

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products." });
    }
};


// Export all functions
module.exports = {
    addProduct,
    getAllProducts,
    deleteSelectedProduct,
    updateSelectedProduct,
    searchProduct,
    restoreProduct,
    fetchInStockProducts,
};
