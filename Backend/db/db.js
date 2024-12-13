const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const db = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        console.log("MongoDB URL:", mongoUrl);

        if (!mongoUrl) {
            throw new Error("MONGO_URL environment variable is not defined");
        }

        await mongoose.connect(mongoUrl.trim());
        console.log("Database connection successful");
    } catch (error) {
        console.error("Database connection failed");
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = { db };
