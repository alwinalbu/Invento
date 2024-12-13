const Store = require("../models/store");


// Add Store
const addStore = async (req, res) => {
  const { userId, name, category, address, city, image } = req.body;

  // Validate required fields
  if (!userId || !name || !category || !address || !city || !image) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const newStore = new Store({
    userID: userId,
    name,
    category,
    address,
    city,
    image,
  });

  try {
    const result = await newStore.save();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};


// Get All Stores
const getAllStores = async (req, res) => {
  const findAllStores = await Store.find({ "userID": req.params.userID }).sort({ _id: -1 }); // -1 for descending;
  res.json(findAllStores);
};

module.exports = { addStore, getAllStores };
