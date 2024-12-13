
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        manufacturer: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        description: String,
        deleted: {  // Added field to indicate soft deletion
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
