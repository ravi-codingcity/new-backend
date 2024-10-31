// routes/counterRoutes.js
const express = require("express");
const Counter = require("../models/Counter");

const router = express.Router();

// Route to get the visitor count from in-memory cache
router.get("/count", async (req, res) => {
  try {
    const counter = await Counter.findOne();
    if (!counter) {
      return res.status(404).json({ error: "Counter not found" });
    }
    res.json({ count: counter.count });
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
});


module.exports = router;

