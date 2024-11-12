// models/Resource.js
const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ["Medical", "Shelter", "Food"] },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  available: { type: Number, required: true },
  capacity: { type: Number, required: true },
});

module.exports = mongoose.model("Resource", resourceSchema);
