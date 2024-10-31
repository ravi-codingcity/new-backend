require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const counterRoutes = require("./routes/counterRoutes");
const Counter = require("./models/Counter");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

let cachedCount = null; // In-memory cache for visitor count

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Initialize cache from DB
const updateCache = async () => {
  try {
    let counter = await Counter.findOne();
    if (!counter) {
      counter = await Counter.create({ count: 0 });
    }
    cachedCount = counter.count;
    console.log("Cache initialized:", cachedCount);
  } catch (error) {
    console.error("Error initializing cache:", error);
  }
};

// Increment counter function (runs every 30 minutes)
const incrementCounter = async () => {
  try {
    cachedCount += 1; // Update in-memory cache
    console.log("Counter incremented in memory:", cachedCount);

    // Update MongoDB
    await Counter.findOneAndUpdate({}, { count: cachedCount, updatedAt: Date.now() });
  } catch (error) {
    console.error("Error incrementing counter:", error);
  }
};

// Load initial count value into cache on startup
updateCache();

// Schedule increment every 30 minutes
setInterval(incrementCounter, 1800000); // 30 minutes in milliseconds

// Routes
app.use("/api", counterRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
