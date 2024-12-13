const express = require("express");
const { addStore, getAllStores } = require("../controller/storeController");
const router = express.Router();


// Add Store 
router.post("/add",addStore);

// Get All Store
router.get("/get/:userID",getAllStores)

module.exports = router;
