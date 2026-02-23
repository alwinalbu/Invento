const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: [true, "Supplier name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },

        companyName: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Please provide a valid email address",
            ],
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            match: [/^[6-9]\d{9}$/, "Enter valid Indian mobile number"],
        },

        address: {
            type: String,
            trim: true,
            maxlength: 200,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);


