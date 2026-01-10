const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  createIncident,
  getIncidents,
  getNearbyIncidents,
  getMyIncidents,
} = require('../controllers/incidentController');
const { optionalAuth, protect } = require('../middleware/auth');

const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many reports from this IP, please try again after 15 minutes',
});

router.route('/')
  .post(createLimiter, optionalAuth, createIncident)
  .get(getIncidents);

router.get('/nearby', getNearbyIncidents);
router.get('/my', protect, getMyIncidents);

module.exports = router;
