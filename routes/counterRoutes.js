const express = require("express");
const Counter = require("../models/Counter");

const router = express.Router();

// Route to get the visitor count from MongoDB
router.get("/count", async (req, res) => {
  try {
    const counter = await Counter.findOne();
    const count = counter ? counter.count : 0; // Default to 0 if no counter exists
    res.json({ count });
  } catch (error) {
    console.error("Error fetching count from MongoDB:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

// Route to increment the visitor count
router.post("/increment", async (req, res) => {
  try {
    await Counter.findOneAndUpdate({}, { $inc: { count: 1 }, updatedAt: Date.now() });
    res.status(200).json({ message: "Counter incremented" });
  } catch (error) {
    console.error("Error incrementing counter:", error);
    res.status(500).json({ error: "Failed to increment count" });
  }
});

module.exports = router;
