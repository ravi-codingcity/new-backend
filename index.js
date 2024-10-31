// index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const redisClient = require("./redisClient");
const counterRoutes = require("./routes/counterRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Initialize visitor count in Redis from MongoDB
const initializeCache = async () => {
  const Counter = require("./models/Counter");
  const counter = await Counter.findOne();
  const count = counter ? counter.count : 0;
  await redisClient.set("visitorCount", count);
};

// Call initializeCache once at server start
initializeCache();

// Schedule MongoDB updates from Redis every 30 minutes
setInterval(async () => {
  const count = await redisClient.get("visitorCount");
  if (count) {
    await Counter.findOneAndUpdate({}, { count }, { upsert: true });
  }
}, 1800000); // 30 minutes in milliseconds

// Use counter routes
app.use("/api", counterRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
