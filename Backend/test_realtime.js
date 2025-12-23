const axios = require('axios');

async function testRealTimeApi() {
    try {
        console.log("Fetching real-time trains...");
        const response = await axios.get('http://localhost:5000/trains/realtime');

        if (response.data.length === 0) {
            console.log("⚠️ No active trains found. (This might be why nothing shows on map)");
        } else {
            console.log(`✅ Found ${response.data.length} active trains:`);
            response.data.forEach(t => {
                console.log(` - Train ${t.trainNumber} (Line ${t.lineId}): Status ${t.status}, Progress ${t.progress?.toFixed(1)}%`);
            });
        }
    } catch (error) {
        console.error("❌ Error fetching API:", error.message);
    }
}

testRealTimeApi();
