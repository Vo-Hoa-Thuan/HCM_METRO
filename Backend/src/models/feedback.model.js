
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: false
  },
  source: {
    type: String,
    required: true,
    enum: ['app', 'website', 'mobile', 'kiosk', 'customer-service', 'other']
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'resolved', 'archived'],
    default: 'new'
  },
  response: {
    type: String,
    required: false
  },
  userEmail: {
    type: String,
    required: false
  },
  userName: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
