const Train = require('../models/train.model');
const Schedule = require('../models/schedule.model');
const Station = require('../models/station.model');
const { calculateTrainPosition, addChaosFactors } = require('../utils/simulation');

exports.getRealTimeTrains = async (req, res) => {
    try {
        const now = new Date();

        // Use a broader window to catch trains that might be slightly delayed or early
        const startWindow = new Date(now.getTime() - 15 * 60000); // 15 mins ago
        const endWindow = new Date(now.getTime() + 60 * 60000);   // 60 mins ahead

        // 1. Get active schedules
        // We look for schedules where departureTime is within our window
        const activeSchedules = await Schedule.find({
            departureTime: { $gte: startWindow, $lte: endWindow },
            status: { $ne: 'cancelled' }
        })
            .populate('train')
            .populate('station')
            .sort({ departureTime: 1 });

        // 2. Group by Train
        const trainMap = {};

        for (const schedule of activeSchedules) {
            if (!schedule.train) continue;
            const trainId = schedule.train._id.toString();

            if (!trainMap[trainId]) {
                trainMap[trainId] = {
                    train: schedule.train,
                    nextSchedule: null,
                    prevSchedule: null
                };
            }

            // Find the immediate next leg for the train rel to NOW
            const departure = new Date(schedule.departureTime).getTime();

            // If this schedule is in top future, it's a candidate for "next station"
            if (departure > now.getTime()) {
                if (!trainMap[trainId].nextSchedule) {
                    trainMap[trainId].nextSchedule = schedule;
                }
            } else {
                // If this schedule is in past, it's a candidate for "prev station" (last departed)
                // Since we sort by time asc, the last one we see is the most recent past
                trainMap[trainId].prevSchedule = schedule;
            }
        }

        // 3. Calculate positions
        const realTimeData = [];

        for (const trainId in trainMap) {
            const { train, nextSchedule, prevSchedule } = trainMap[trainId];

            if (prevSchedule && nextSchedule) {
                // Train is between stations!
                const fromStation = prevSchedule.station;
                const toStation = nextSchedule.station;

                // Construct a virtual "leg" schedule
                const legSchedule = {
                    departureTime: prevSchedule.departureTime,
                    arrivalTime: nextSchedule.arrivalTime // Or heuristic: dep + duration
                };

                // Heuristic: if we don't have explicit arrival time at next station from a "Trip" concept,
                // we can assume arrival matches the schedule's arrivalTime at that station.
                // NOTE: The current Schedule model seems to store arrival/departure for EACH station stop.
                // So: Prev Station (Dep: 8:00) -> Next Station (Arr: 8:05).
                // Let's use that.

                // Correction: The `calculateTrainPosition` expects a schedule object with `departureTime` (from Start) and `arrivalTime` (at End).
                // But `prevSchedule` is the stop at Start, `nextSchedule` is the stop at End.

                const leg = {
                    departureTime: prevSchedule.departureTime,
                    arrivalTime: nextSchedule.arrivalTime
                };

                let position = calculateTrainPosition(leg, fromStation, toStation, now);

                if (position) {
                    position = addChaosFactors(position);
                    realTimeData.push({
                        trainId: train._id,
                        trainNumber: train.trainNumber,
                        lineId: train.line,
                        ...position
                    });
                }
            } else if (nextSchedule && !prevSchedule) {
                // Train hasn't started first station yet or just spawned
                // Show at station
                realTimeData.push({
                    trainId: train._id,
                    trainNumber: train.trainNumber,
                    lineId: train.line,
                    lat: nextSchedule.station.coordinates[1],
                    lng: nextSchedule.station.coordinates[0],
                    status: 'at_station',
                    stationId: nextSchedule.station._id,
                    speed: 0,
                    bearing: 0
                });
            } else if (prevSchedule && !nextSchedule) {
                // Train passed last known schedule
                realTimeData.push({
                    trainId: train._id,
                    trainNumber: train.trainNumber,
                    lineId: train.line,
                    lat: prevSchedule.station.coordinates[1],
                    lng: prevSchedule.station.coordinates[0],
                    status: 'at_station',
                    stationId: prevSchedule.station._id,
                    speed: 0,
                    bearing: 0
                });
            }
        }

        return res.status(200).json(realTimeData);

    } catch (error) {
        console.error("Simulation error:", error);
        res.status(500).json({ message: "Error calculating real-time positions", error: error.message });
    }
};
