const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { db } = require('./db/db');
const userRoutes = require('./router/userRoutes');
const productRoutes = require('./router/productRoutes');
const purchaseRoutes = require('./router/purchaseRoutes');
const storeRoutes = require('./router/storeRoutes');
const salesRoutes = require('./router/salesRoutes');
const supplierRoutes = require("./router/supplierRoutes");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('./middleWare/errorMiddleware');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

const allowedOrigins = [process.env.CLIENT_URL];
const clientUrl = process.env.CLIENT_URL;

console.log(`Client URL: ${clientUrl}`);

if (!process.env.CLIENT_URL) {
    console.error('CLIENT_URL is not set in the environment variables');
}

const corsOptions = {
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(cors(corsOptions));

//Route
// ✅ Mount supplier first
app.use("/supplier", supplierRoutes);
app.use("/product", productRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/store", storeRoutes);
app.use("/sales", salesRoutes);
app.use("/", userRoutes);

//Error Middleware

app.use(errorHandler);


//Connect to DB and Server 

const startServer = async () => {
    try {
        await db(); 
        app.listen(PORT, () => {
            console.log(`Server started at PORT: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start the server:", error.message);
        process.exit(1);
    }
};

startServer();
