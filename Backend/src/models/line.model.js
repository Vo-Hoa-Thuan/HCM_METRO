const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, enum: ['delay', 'closure', 'maintenance', 'info'], required: true },
  message: String,
  startDate: String,
  endDate: String,
  active: Boolean,
});

const metroLineSchema = new mongoose.Schema({
  name: String,
  color: String,
  stations: [String],
  operatingHours: {
    weekday: String,
    weekend: String
  },
  frequency: {
    peakHours: String,
    offPeakHours: String
  },
  status: {
    type: String,
    enum: ['operational', 'construction', 'planned', 'closed']
  },
  openingDate: String,
  length: Number,
  alerts: [alertSchema]
}, { timestamps: true });

module.exports = mongoose.model('MetroLine', metroLineSchema);
