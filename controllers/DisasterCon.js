// controllers/disasterController.js
const Disaster = require("../models/Disaster");

// Fetch all disasters
exports.getDisasters = async (req, res) => {
  try {
    const disasters = await Disaster.find();
    res.json(disasters);
  } catch (error) {
    res.status(500).json({ error: "Error fetching disasters" });
  }
};

// Add a new disaster
exports.addDisaster = async (req, res) => {
  try {
    const disaster = new Disaster(req.body);
    await disaster.save();
    res.status(201).json(disaster);
  } catch (error) {
    res.status(400).json({ error: "Error adding disaster" });
  }
};
