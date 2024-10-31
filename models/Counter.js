const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Counter", counterSchema);
