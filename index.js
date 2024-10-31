// index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const counterRoutes = require("./routes/counterRoutes");
const Counter = require("./models/Counter");

const app = express();
const PORT = process.env.PORT || 5000;
let cachedCount = null; // In-memory cache for visitor count

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Initialize cache function
async function updateCache() {
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
}

// Start server after initializing cache
(async () => {
  await updateCache(); // Ensure cache is populated before server start
  app.use("/api", counterRoutes); // Use counter routes after cache is ready

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

// Increment function scheduled to run every 30 minutes
setInterval(async () => {
  cachedCount += 1;
  console.log("Counter incremented in memory:", cachedCount);
  await Counter.findOneAndUpdate({}, { count: cachedCount, updatedAt: Date.now() });
}, 1800000);
