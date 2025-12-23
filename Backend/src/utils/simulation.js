const geolib = require('geolib');

/**
 * Calculates current position of a train based on schedule and current time
 * @param {Object} schedule - The schedule object containing departure/arrival times for a specific leg
 * @param {Object} fromStation - The starting station object (must have coordinates)
 * @param {Object} toStation - The destination station object (must have coordinates)
 * @param {Date} now - Current time
 * @returns {Object|null} - Current position { lat, lng, bearing, speed } or null if not in this leg
 */
const calculateTrainPosition = (schedule, fromStation, toStation, now) => {
    const departure = new Date(schedule.departureTime).getTime();
    const arrival = new Date(schedule.arrivalTime).getTime();
    const currentTime = now.getTime();

    // If train is waiting at station (within departure window or slightly before)
    if (currentTime < departure && currentTime >= departure - 300000) { // 5 mins before departure
        return {
            lat: fromStation.coordinates[1],
            lng: fromStation.coordinates[0],
            status: 'at_station',
            stationId: fromStation._id,
            bearing: 0,
            speed: 0
        };
    }

    // If train has finished this leg
    if (currentTime > arrival) {
        return null; // Should look for next leg
    }

    // Train is moving between stations
    if (currentTime >= departure && currentTime <= arrival) {
        const totalDuration = arrival - departure;
        const elapsed = currentTime - departure;
        const progress = elapsed / totalDuration; // 0.0 to 1.0

        // Linear interpolation for coordinates
        const lat = fromStation.coordinates[1] + (toStation.coordinates[1] - fromStation.coordinates[1]) * progress;
        const lng = fromStation.coordinates[0] + (toStation.coordinates[0] - fromStation.coordinates[0]) * progress;

        // Calculate bearing (direction)
        const bearing = geolib.getRhumbLineBearing(
            { latitude: fromStation.coordinates[1], longitude: fromStation.coordinates[0] },
            { latitude: toStation.coordinates[1], longitude: toStation.coordinates[0] }
        );

        // Estimate speed (km/h) - crude estimation
        // Real logic would use distance / time
        const distanceMeters = geolib.getDistance(
            { latitude: fromStation.coordinates[1], longitude: fromStation.coordinates[0] },
            { latitude: toStation.coordinates[1], longitude: toStation.coordinates[0] }
        );
        const speedKmph = (distanceMeters / 1000) / (totalDuration / 3600000);

        return {
            lat,
            lng,
            status: 'moving',
            fromStationId: fromStation._id,
            toStationId: toStation._id,
            progress: progress * 100,
            bearing,
            speed: Math.round(speedKmph * 10) / 10 // Round to 1 decimal
        };
    }

    return null;
};

/**
 * Adds random delay and crowd factors
 * @param {Object} baseData 
 * @returns {Object}
 */
const addChaosFactors = (baseData) => {
    if (!baseData) return null;

    // Simulate minor GPS drift or calculation noise
    const drift = (Math.random() - 0.5) * 0.0001;

    // Crowd level based on time of day (Mock)
    const hour = new Date().getHours();
    let crowdLevel = 'low';
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
        crowdLevel = 'high';
    } else if (hour >= 10 && hour <= 16) {
        crowdLevel = 'medium';
    }

    return {
        ...baseData,
        lat: baseData.lat + drift,
        lng: baseData.lng + drift,
        crowdLevel,
        updatedAt: new Date()
    };
};

module.exports = {
    calculateTrainPosition,
    addChaosFactors
};
