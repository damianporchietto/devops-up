const mongoose = require('mongoose')

const measurementSchema = new mongoose.Schema({
  value:      { type: Number, required: true },
  station_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Measurement', measurementSchema) 