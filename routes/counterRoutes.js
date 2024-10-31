const express = require("express");
const Counter = require("../models/Counter");

const router = express.Router();

// Route to get the visitor count without incrementing
router.get("/count", async (req, res) => {
  try {
    const counter = await Counter.findOne();
    res.json({ count: counter ? counter.count : 0 });
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

module.exports = router;
