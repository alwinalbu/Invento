const express = require("express");
const router = express.Router();
const Supplier = require("../models/supplierModel");

// ✅ Add new supplier
router.post("/add", async (req, res) => {
    try {
        const supplier = new Supplier(req.body);
        await supplier.save();

        res.status(201).json({
            success: true,
            message: "Supplier added successfully",
            supplier,
        });

    } catch (error) {

        // Handle Mongoose validation errors
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(
                (err) => err.message
            );

            return res.status(400).json({
                success: false,
                errors,
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});


// ✅ Get all suppliers for a specific user
router.get("/get/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const suppliers = await Supplier.find({ userId });
        res.status(200).json(suppliers);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ message: "Error fetching suppliers", error });
    }
});

// ✅ Edit supplier
router.put("/:id", async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }   // 👈 VERY IMPORTANT
        );

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.json({
            success: true,
            message: "Supplier updated successfully",
            supplier,
        });

    } catch (error) {

        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(
                (err) => err.message
            );

            return res.status(400).json({
                success: false,
                errors,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error updating supplier",
        });
    }
});


// ✅ Toggle supplier active/inactive
router.patch("/:id/toggle", async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier)
            return res.status(404).json({ message: "Supplier not found" });

        supplier.isActive = !supplier.isActive;
        await supplier.save();

        res.json({
            message: supplier.isActive
                ? "Supplier activated successfully"
                : "Supplier blocked successfully",
            supplier,
        });
    } catch (error) {
        res.status(500).json({ message: "Error toggling supplier", error });
    }
});

module.exports = router;

