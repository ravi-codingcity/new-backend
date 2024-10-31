require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const counterRoutes = require("./routes/counterRoutes");
const Counter = require("./models/Counter");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Create the Counter document if it doesn't exist
async function initializeCounter() {
  try {
    const counter = await Counter.findOne();
    if (!counter) {
      await Counter.create({ count: 0 });
      console.log("Counter initialized to 0");
    }
  } catch (error) {
    console.error("Error initializing counter:", error);
  }
}

// Increment the counter every 10 minutes
async function incrementCounter() {
  try {
    const result = await Counter.findOneAndUpdate({}, { $inc: { count: 1 }, updatedAt: Date.now() }, { new: true });
    console.log("Counter incremented to:", result.count);
  } catch (error) {
    console.error("Error incrementing counter:", error);
  }
}

// Start server after ensuring the counter is initialized
(async () => {
  await initializeCounter(); // Ensure counter document exists
  app.use("/api", counterRoutes); // Use counter routes

  // Set interval to increment counter every 10 minutes (600000 milliseconds)
  setInterval(incrementCounter, 3600000);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
