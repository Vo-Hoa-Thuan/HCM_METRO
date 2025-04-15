const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nameVi: {
    type: String,
    required: true
  },
  coordinates: {
    type: [Number], 
    required: true,
    validate: {
      validator: (v) => v.length === 2,
      message: 'coordinates must be [longitude, latitude]'
    }
  },
  address: {
    type: String,
    required: true
  },
  lines: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'MetroLine' }
  ]
  
  ,
  facilities: {
    type: [String],
    default: []
  },
  dailyPassengers: {
    type: Number,
    default: 0
  },
  isInterchange: {
    type: Boolean,
    default: false
  },
  isDepot: {
    type: Boolean,
    default: false
  },
  isUnderground: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['operational', 'construction', 'planned', 'closed'],
    default: 'operational'
  },
  hasWifi: {
    type: Boolean,
    default: false
  },
  hasParking: {
    type: Boolean,
    default: false
  },
  hasTicketMachine: {
    type: Boolean,
    default: false
  },
  hasAccessibility: {
    type: Boolean,
    default: false
  },
  hasBathroom: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Station', StationSchema);
