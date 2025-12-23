import { Station } from '@/api/stationsApi';
import { getDistance } from 'geolib';

// Average speed (km/h) fallback
const AVERAGE_SPEED_KMH = 35;

export interface RealTimeTrain {
    trainId: string;
    trainNumber: string;
    lineId: string;
    lat: number;
    lng: number;
    speed: number; // km/h
    status: string;
    // ... other fields
}

/**
 * Calculates the estimated time of arrival (in minutes) for the nearest train to reach a station.
 * @param stationId The ID of the station to check.
 * @param lineId The line ID.
 * @param realTimeTrains List of active trains.
 * @param stations List of all stations (to get coordinates).
 * @returns Estimated minutes or null if no data.
 */
export const calculateETA = (
    stationId: string,
    lineId: string,
    realTimeTrains: RealTimeTrain[],
    stations: Station[]
): number | null => {
    const targetStation = stations.find(s => s.id === stationId);
    if (!targetStation) return null;

    // Filter trains on the same line
    const trainsOnLine = realTimeTrains.filter(t => t.lineId === lineId && t.status !== 'maintenance');
    if (trainsOnLine.length === 0) return null;

    // Find nearest train that is heading TOWARDS the station
    // Simplification: We just find the physically nearest train for now.
    // In a real system, we need vector/direction check using bearing or station order index.

    let minTime = Infinity;

    trainsOnLine.forEach(train => {
        const distMeters = getDistance(
            { latitude: train.lat, longitude: train.lng },
            { latitude: targetStation.coordinates[1], longitude: targetStation.coordinates[0] }
        );

        // Convert speed to m/min
        // If train speed is 0 (at station), use average speed
        const speedKmh = train.speed > 0 ? train.speed : AVERAGE_SPEED_KMH;
        const speedMpm = (speedKmh * 1000) / 60;

        const timeMins = distMeters / speedMpm;

        if (timeMins < minTime) {
            minTime = timeMins;
        }
    });

    return minTime === Infinity ? null : Math.round(minTime);
};
