// models/Disaster.js
const mongoose = require("mongoose");

const disasterSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Earthquake", "Flood", "Tsunami", "Cyclone", "Other"],
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  severity: String, // optional, e.g., High, Medium, Low
  magnitude: Number, // optional for earthquakes
  waterLevel: String, // optional for floods
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

disasterSchema.index({ location: "2dsphere" }); // Enable geospatial indexing

module.exports = mongoose.model("Disaster", disasterSchema);
