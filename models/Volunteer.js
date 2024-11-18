const mongoose = require("mongoose");

const VolunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
  },
  skills: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Volunteer", VolunteerSchema);
