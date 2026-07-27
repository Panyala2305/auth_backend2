import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";


const app = express();

app.use(express.json());

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();
// Test Route
app.get("/", (req, res) => {
    res.send("Server is Running...");
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});