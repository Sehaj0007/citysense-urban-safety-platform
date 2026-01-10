const asyncHandler = require('express-async-handler');
const Incident = require('../models/Incident');
const User = require('../models/User');

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const totalIncidents = await Incident.countDocuments();
  const totalUsers = await User.countDocuments();

  const incidentsByType = await Incident.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);

  const recentIncidents = await Incident.find()
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    totalIncidents,
    totalUsers,
    incidentsByType,
    recentIncidents,
  });
});

module.exports = {
  getAnalytics,
};
