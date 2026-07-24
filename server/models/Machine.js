const mongoose = require('mongoose')

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Tractor', 'Harvester', 'Sprayer', 'Seeder'], default: 'Tractor' },
  owner: { type: String, required: true },
  ownerPhone: { type: String },
  distance: { type: String },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  location: {
    lat: Number,
    lng: Number,
  },
}, { timestamps: true })

module.exports = mongoose.model('Machine', machineSchema)