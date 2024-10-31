// counterRoutes.js
const express = require("express");
const Counter = require("../models/Counter");

const router = express.Router();
let cachedCount = null; // Ensure it's initialized by `index.js`

// Route to get the visitor count
router.get("/count", async (req, res) => {
  try {
    // If cache is not yet populated, fetch directly from MongoDB
    if (cachedCount === null) {
      const counter = await Counter.findOne();
      cachedCount = counter ? counter.count : 0;
    }
    res.json({ count: cachedCount });
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

module.exports = router;
