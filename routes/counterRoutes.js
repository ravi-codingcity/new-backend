// counterRoutes.js
const express = require("express");
const Counter = require("../models/Counter");

const router = express.Router();
let cachedCount = null; // In-memory cache for visitor count

// Initialize cache from DB on startup
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

// Route to get the visitor count
router.get("/count", async (req, res) => {
  try {
    // Use cached count for faster response
    res.json({ count: cachedCount });
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

module.exports = router;
