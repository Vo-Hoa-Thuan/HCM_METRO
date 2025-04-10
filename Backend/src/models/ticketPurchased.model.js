const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsedTripSchema = new Schema({
  trip_id: {
    type: Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const TicketPurchasedSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticket_type_id: {
    type: Schema.Types.ObjectId,
    ref: 'TicketType',
    required: true
  },
  purchase_date: {
    type: Date,
    default: Date.now
  },
  expiration_date: {
    type: Date,
    default: null
  },
  remaining_trips: {
    type: Number,
    default: null
  },
  is_active: {
    type: Boolean,
  },
  payment_id: {
    type: Schema.Types.ObjectId,
    ref: 'Payment'
  },
  used_trips: [UsedTripSchema],
  feedback_allowed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('TicketPurchased', TicketPurchasedSchema);
