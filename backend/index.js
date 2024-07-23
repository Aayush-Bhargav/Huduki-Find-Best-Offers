import express from 'express';
import connectToMongoDB from './database.js';
import cors from "cors"
import authRouter from './routes/auth.js';
import restaurantRouter from './routes/restuarant.js';
import paymentRouter from './routes/payment.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import "./middleware/restaurantCleanup.js";
import { fileURLToPath } from 'url';
//made the required imports
// Import cors module

connectToMongoDB();
const app = express();//set up the express app
const PORT = 5000;
app.use(cors());
dotenv.config({ path: '../backend/.env' }); // Adjust the path as per your project structure

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//allow body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.resolve(__dirname, '../public')));
//specify various route handlers
app.use("/api/auth", authRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/payment", paymentRouter);

app.get("/", (req, res) => {
    res.send('Hi!');
})
app.listen(PORT, () => { //set up the server
    console.log(`Server set up on port ${PORT}`);
})