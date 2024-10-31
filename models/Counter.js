// models/Counter.js
const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 10, // Starting value
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Counter", counterSchema);
