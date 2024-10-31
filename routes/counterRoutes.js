const express = require("express");
const Counter = require("../models/Counter");

const router = express.Router();

// Route to get the visitor count from the database
router.get("/count", async (req, res) => {
  try {
    // Fetch the current counter from the database
    const counter = await Counter.findOne();
    
    // If the counter does not exist, return 0 (or handle as needed)
    if (!counter) {
      return res.json({ count: 0 }); // or create a counter with initial value if desired
    }

    // Send the current count immediately
    res.json({ count: counter.count });
    
    // Increment the counter in the database for the next request
    counter.count += 1;
    await counter.save();
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

module.exports = router;
