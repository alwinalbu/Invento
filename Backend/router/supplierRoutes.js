// const express = require("express");
// const router = express.Router();
// const Supplier = require("../models/supplierModel");



// // ✅ Add new supplier
// router.post("/add", async (req, res) => {
//     try {
//         const supplier = new Supplier(req.body);
//         await supplier.save();
//         res.status(201).json(supplier);
//     } catch (error) {
//         console.error("Error adding supplier:", error);
//         res.status(400).json({ message: "Error adding supplier", error });
//     }
// });


// // ✅ Get all suppliers
// router.get("/get", async (req, res) => {
//     try {
//         const suppliers = await Supplier.find();
//         res.status(200).json(suppliers);
//     } catch (error) {
//         console.error("Error fetching suppliers:", error);
//         res.status(500).json({ message: "Error fetching suppliers", error });
//     }
// });



// // Edit supplier
// router.put("/:id", async (req, res) => {
//     try {
//         const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//         });
//         if (!supplier) {
//             return res.status(404).json({ message: "Supplier not found" });
//         }
//         res.json(supplier);
//     } catch (error) {
//         res.status(500).json({ message: "Error updating supplier", error });
//     }
// });

// // Toggle supplier active/inactive
// router.patch("/:id/toggle", async (req, res) => {
//     try {
//         const supplier = await Supplier.findById(req.params.id);
//         if (!supplier)
//             return res.status(404).json({ message: "Supplier not found" });

//         supplier.isActive = !supplier.isActive; 
//         await supplier.save();

//         res.json({
//             message: supplier.isActive
//                 ? "Supplier activated successfully"
//                 : "Supplier blocked successfully",
//             supplier,
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error toggling supplier", error });
//     }
// });



// module.exports = router;

const express = require("express");
const router = express.Router();
const Supplier = require("../models/supplierModel");

// ✅ Add new supplier
router.post("/add", async (req, res) => {
    try {
        const { userId, name, companyName, email, phone, address } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const supplier = new Supplier({
            userId,
            name,
            companyName,
            email,
            phone,
            address,
        });

        await supplier.save();
        res.status(201).json(supplier);
    } catch (error) {
        console.error("Error adding supplier:", error);
        res.status(400).json({ message: "Error adding supplier", error });
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
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.json(supplier);
    } catch (error) {
        res.status(500).json({ message: "Error updating supplier", error });
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

