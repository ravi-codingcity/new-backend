// routes/counterRoutes.js
const express = require("express");
const Counter = require("../models/Counter");

const router = express.Router();

// Route to get the visitor count directly from MongoDB
router.get("/count", async (req, res) => {
  try {
    // Fetch the counter document directly from MongoDB
    const counter = await Counter.findOne();
    
    // If no counter document exists, return a count of 0
    const count = counter ? counter.count : 0;

    // Return the fetched count
    res.json({ count });
  } catch (error) {
    console.error("Error fetching count from MongoDB:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

module.exports = router;
