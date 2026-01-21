const asyncHandler = require('express-async-handler');
const Incident = require('../models/Incident');

// @desc    Create new incident
// @route   POST /api/incidents
// @access  Public (Optional Auth)
const createIncident = asyncHandler(async (req, res) => {
  const { type, description, latitude, longitude, address, imageUrl, isAnonymous } = req.body;

  if (!type || !latitude || !longitude) {
    res.status(400);
    throw new Error('Please include type, latitude and longitude');
  }

  // Prevent duplicate spam (simple check: same type & location within 10 mins)
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const duplicate = await Incident.findOne({
    type,
    'location.coordinates': [longitude, latitude],
    createdAt: { $gte: tenMinutesAgo }
  });

  if (duplicate) {
    res.status(429);
    throw new Error('Duplicate report detected. Please wait before reporting again.');
  }

  const incident = await Incident.create({
    user: req.user ? req.user.id : null,
    type,
    description,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    address,
    imageUrl,
    isAnonymous: isAnonymous || false,
  });

  // Emit real-time alert
  const io = req.app.get('io');
  if (io) {
    io.emit('new_incident', incident);
  }

  res.status(201).json(incident);
});

// @desc    Get all incidents
// @route   GET /api/incidents
// @access  Public
const getIncidents = asyncHandler(async (req, res) => {
  const incidents = await Incident.find().sort({ createdAt: -1 });
  res.status(200).json(incidents);
});

// @desc    Get nearby incidents
// @route   GET /api/incidents/nearby
// @access  Public
const getNearbyIncidents = asyncHandler(async (req, res) => {
  const { lat, lng, dist } = req.query; // dist in meters

  if (!lat || !lng) {
      res.status(400);
      throw new Error('Please provide lat and lng');
  }

  const maxDistance = dist ? parseInt(dist) : 5000; // Default 5km

  const incidents = await Incident.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: maxDistance,
      },
    },
  });

  res.status(200).json(incidents);
});

// @desc    Get current user's incidents
// @route   GET /api/incidents/my
// @access  Private
const getMyIncidents = asyncHandler(async (req, res) => {
  const incidents = await Incident.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(incidents);
});

// @desc    Get incident by ID
// @route   GET /api/incidents/:id
// @access  Public
const getIncidentById = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id).populate('user', 'name email phone');

  if (!incident) {
    res.status(404);
    throw new Error('Incident not found');
  }

  res.status(200).json(incident);
});

module.exports = {
  createIncident,
  getIncidents,
  getNearbyIncidents,
  getMyIncidents,
  getIncidentById,
};
