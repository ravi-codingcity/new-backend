const express = require("express");
const Counter = require("../models/Counter");

const router = express.Router();

// Route to get the visitor count from the database
router.get("/count", async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      {}, // Find the first document
      { $inc: { count: 1 } }, // Increment the count
      { new: true, upsert: true } // Return the updated document, create if it doesn't exist
    );

    // Send the updated count as a response
    res.json({ count: counter.count });
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

module.exports = router;
