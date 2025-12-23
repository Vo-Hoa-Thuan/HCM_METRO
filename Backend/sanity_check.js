console.log("Sanity check: Node execution works.");
console.log("Current Directory:", process.cwd());
try {
    const config = require('./src/config/config');
    console.log("Config loaded:", config);
} catch (e) {
    console.error("Config load error:", e);
}
