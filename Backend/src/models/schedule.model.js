const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    line: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MetroLine',
        required: true
    },
    train: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Train',
        required: true
    },
    station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: true
    },
    order: {
        type: Number,
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
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'delayed', 'cancelled'],
        default: 'scheduled'
    },
    crowdLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    }
}, {
    timestamps: true
});

// Indexes
scheduleSchema.index({ line: 1 });
scheduleSchema.index({ train: 1 });
scheduleSchema.index({ station: 1 });
scheduleSchema.index({ order: 1 });
scheduleSchema.index({ arrivalTime: 1 });
scheduleSchema.index({ status: 1 });

// Methods
scheduleSchema.methods.updateStatus = async function (newStatus) {
    this.status = newStatus;
    return this.save();
};

scheduleSchema.methods.updateDelay = async function (delay) {
    this.delay = delay;
    if (delay > 0) {
        this.status = 'delayed';
    }
    return this.save();
};

scheduleSchema.methods.updateCrowdLevel = async function (level) {
    this.crowdLevel = level;
    return this.save();
};

// Static methods
scheduleSchema.statics.findByLineAndDate = function (lineId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.find({
        line: lineId,
        arrivalTime: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    })
        .populate('train')
        .populate('station')
        .sort({ order: 1 });
};

scheduleSchema.statics.findByStationAndDate = function (stationId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.find({
        station: stationId,
        arrivalTime: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    })
        .populate('train')
        .populate('line')
        .sort({ arrivalTime: 1 });
};

scheduleSchema.statics.findActiveSchedules = function () {
    const now = new Date();
    return this.find({
        status: { $in: ['scheduled', 'in-progress'] },
        arrivalTime: { $gte: now }
    })
        .populate('train')
        .populate('station')
        .populate('line')
        .sort({ arrivalTime: 1 });
};

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule; 