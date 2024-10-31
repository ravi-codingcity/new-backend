const express = require("express");
const Counter = require("../models/Counter");

const router = express.Router();
let cachedCount = null; // In-memory cache for the visitor count

// Function to refresh the cached count from MongoDB
async function refreshCachedCount() {
  try {
    const counter = await Counter.findOne();
    cachedCount = counter ? counter.count : 0; // Default to 0 if no counter exists
  } catch (error) {
    console.error("Error fetching count from MongoDB:", error);
  }
}

// Route to get the visitor count from cache or MongoDB
router.get("/count", async (req, res) => {
  // Refresh cache if not initialized
  if (cachedCount === null) {
    await refreshCachedCount();
  }
  
  // Respond with cached count
  res.json({ count: cachedCount });
});

// Route to increment the visitor count
router.post("/increment", async (req, res) => {
  try {
    // Increment in MongoDB and refresh the cache
    const result = await Counter.findOneAndUpdate({}, { $inc: { count: 1 }, updatedAt: Date.now() }, { new: true });
    cachedCount = result.count; // Update cache with new count
    res.status(200).json({ message: "Counter incremented", count: cachedCount });
  } catch (error) {
    console.error("Error incrementing counter:", error);
    res.status(500).json({ error: "Failed to increment count" });
  }
});

// Initial cache population
refreshCachedCount();

module.exports = router;
