const mongoose = require('mongoose');

const incidentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Can be anonymous
  },
  type: {
    type: String,
    required: true,
    enum: ['harassment', 'theft', 'unsafe_lighting', 'stalking', 'assault', 'suspicious_activity', 'noise_complaint', 'vandalism', 'traffic_hazard', 'public_disturbance','other'],
  },
  description: {
    type: String,
    required: false,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  address: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['reported', 'verified', 'spam'],
    default: 'reported',
  },
  upvotes: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

// Create 2dsphere index for geospatial queries
incidentSchema.index({ location: '2dsphere' });

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;
