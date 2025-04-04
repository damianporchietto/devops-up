const mongoose = require('mongoose')

const stationSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  long:        { type: Number, required: true },
  lat:         { type: Number, required: true },
  type:        { type: String, required: true },
  code:        { type: String, required: true, unique: true },
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Station', stationSchema) 