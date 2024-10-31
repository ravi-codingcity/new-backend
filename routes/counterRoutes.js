// routes/counterRoutes.js
const express = require("express");
const Counter = require("../models/Counter");

const router = express.Router();

// Route to get the visitor count from in-memory cache or MongoDB
router.get("/count", async (req, res) => {
  try {
    // If cachedCount is null, fetch from MongoDB
    if (cachedCount === null) {
      const counter = await Counter.findOne();
      if (counter) {
        cachedCount = counter.count; // Update the cache with MongoDB value
      } else {
        cachedCount = 0; // Default if no counter exists
        console.error("Counter document not found, initialized to 0");
      }
    }
    
    // Return the cached count
    res.json({ count: cachedCount });
  } catch (error) {
    console.error("Error fetching count from MongoDB:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

module.exports = router;
