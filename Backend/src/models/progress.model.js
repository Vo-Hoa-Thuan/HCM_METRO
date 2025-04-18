
const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  lineId: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  estimatedCompletionDate: {
    type: Date,
    required: true
  },
  actualCompletionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'delayed'],
    default: 'not-started'
  },
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  location: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  milestones: [{
    title: String,
    date: Date,
    description: String,
    isCompleted: Boolean
  }],
  updates: [{
    date: {
      type: Date,
      default: Date.now
    },
    description: String,
    percentageChange: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps on save
ProgressSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Progress', ProgressSchema);
