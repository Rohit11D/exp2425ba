// controllers/analyticsController.js
const Disaster = require("../models/Disaster");

exports.getAnalyticsData = async (req, res) => {
  try {
    const analyticsData = await Disaster.aggregate([
      {
        $group: {
          _id: { $month: "$timestamp" },
          earthquakes: {
            $sum: { $cond: [{ $eq: ["$type", "Earthquake"] }, 1, 0] },
          },
          floods: { $sum: { $cond: [{ $eq: ["$type", "Flood"] }, 1, 0] } },
        },
      },
    ]);
    res.json(analyticsData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching analytics data" });
  }
};
