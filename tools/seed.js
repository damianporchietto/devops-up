// seedData.js
require('dotenv').config(); // If you have a .env file, this loads it
const mongoose = require('mongoose');

// === 1. CONNECT TO MONGODB ===
// Use MONGO_URI from the environment or a fallback (not recommended in production)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stations_dev';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(`Connected to MongoDB at ${MONGO_URI}`))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// === 2. DEFINE MODELS (or import them) ===

const stationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    long: { type: Number, required: true },
    lat: { type: Number, required: true },
    type: { type: String, required: true },
    code: { type: String, required: true, unique: true },
  },
  { timestamps: true, versionKey: false }
);

const measurementSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true },
    station_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
  },
  { timestamps: true, versionKey: false }
);

const Station = mongoose.model('Station', stationSchema);
const Measurement = mongoose.model('Measurement', measurementSchema);

// === 3. SEED LOGIC ===
async function seedData() {
  try {
    // Clear out old data (optional)
    await Station.deleteMany({});
    await Measurement.deleteMany({});

    // Create a few random stations
    const stationCount = 50;
    const stationsData = [];

    for (let i = 0; i < stationCount; i++) {
      stationsData.push({
        name: `Station ${i + 1}`,
        long: (Math.random() * 360 - 180).toFixed(4), // random longitude
        lat: (Math.random() * 180 - 90).toFixed(4),   // random latitude
        type: Math.random() < 0.5 ? 'automatic' : 'manual',
        code: `STATION_CODE_${i + 1}`,
      });
    }

    const stations = await Station.insertMany(stationsData);
    console.log(`Inserted ${stations.length} stations`);

    // For each station, create some measurements
    const measurementCountPerStation = Math.floor(Math.random() * 1000) + 1;
    let measurementsData = [];

    for (let station of stations) {
      for (let i = 0; i < measurementCountPerStation; i++) {
        measurementsData.push({
          value: parseFloat((Math.random() * 100).toFixed(2)), // random value, up to 2 decimals
          station_id: station._id,
        });
      }
    }

    const measurements = await Measurement.insertMany(measurementsData);
    console.log(`Inserted ${measurements.length} measurements`);

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedData();
