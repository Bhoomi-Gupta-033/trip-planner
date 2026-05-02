const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  destination: String,
  days: Number,
  budget: String,
  interests: [String],
  itinerary: Object,
  budgetEstimate: Object,

  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Trip", tripSchema);
