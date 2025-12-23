const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    trainNumber: {
        type: String,
        required: true,
        unique: true
    },
    line: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MetroLine',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'inactive'],
        default: 'active'
    },
    currentStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station'
    },
    nextStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station'
    },
    schedule: [{
        station: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Station',
            required: true
        },
        arrivalTime: {
            type: Date,
            required: true
        },
        departureTime: {
            type: Date,
            required: true
        },
        delay: {
            type: Number,
            default: 0
        }
    }],
    crowdLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
trainSchema.index({ trainNumber: 1 });
trainSchema.index({ line: 1 });
trainSchema.index({ status: 1 });
trainSchema.index({ currentStation: 1 });
trainSchema.index({ 'schedule.station': 1 });

// Methods
trainSchema.methods.updateStatus = async function (newStatus) {
    this.status = newStatus;
    this.lastUpdated = new Date();
    return this.save();
};

trainSchema.methods.updateLocation = async function (currentStation, nextStation) {
    this.currentStation = currentStation;
    this.nextStation = nextStation;
    this.lastUpdated = new Date();
    return this.save();
};

trainSchema.methods.updateSchedule = async function (schedule) {
    this.schedule = schedule;
    this.lastUpdated = new Date();
    return this.save();
};

trainSchema.methods.updateCrowdLevel = async function (level) {
    this.crowdLevel = level;
    this.lastUpdated = new Date();
    return this.save();
};

// Static methods
trainSchema.statics.findActiveTrains = function () {
    return this.find({ status: 'active' })
        .populate('line')
        .populate('currentStation')
        .populate('nextStation')
        .populate('schedule.station');
};

trainSchema.statics.findTrainsByLine = function (lineId) {
    return this.find({ line: lineId })
        .populate('currentStation')
        .populate('nextStation')
        .populate('schedule.station');
};

trainSchema.statics.findTrainsByStation = function (stationId) {
    return this.find({
        $or: [
            { currentStation: stationId },
            { nextStation: stationId },
            { 'schedule.station': stationId }
        ]
    })
        .populate('line')
        .populate('currentStation')
        .populate('nextStation')
        .populate('schedule.station');
};

const Train = mongoose.model('Train', trainSchema);

module.exports = Train; 