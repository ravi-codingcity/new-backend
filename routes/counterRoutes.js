// routes/counterRoutes.js
const express = require("express");
const redisClient = require("../redisClient");

const router = express.Router();

// Get the count from Redis
router.get("/count", async (req, res) => {
  try {
    const count = await redisClient.get("visitorCount");
    res.json({ count: parseInt(count) });
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

// Increment the count in Redis
router.post("/increment", async (req, res) => {
  try {
    const count = await redisClient.incr("visitorCount");
    res.json({ count });
  } catch (error) {
    console.error("Error incrementing count:", error);
    res.status(500).json({ error: "Failed to increment count" });
  }
});

module.exports = router;
