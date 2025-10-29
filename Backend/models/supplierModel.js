// const mongoose = require("mongoose");

// const supplierSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: true,
//             trim: true,
//         },
//         companyName: {
//             type: String,
//             trim: true,
//         },
//         email: {
//             type: String,
//             trim: true,
//         },
//         phone: {
//             type: String,
//             trim: true,
//         },
//         address: {
//             type: String,
//             trim: true,
//         },
//         isActive: { type: Boolean, default: true },
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("Supplier", supplierSchema);

const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // 👈 assuming you have a User model
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        companyName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);

