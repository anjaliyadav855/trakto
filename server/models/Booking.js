const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  machine: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
  farmerName: { type: String, required: true },
  farmerPhone: { type: String, required: true },
  workType: { type: String },
  location: { type: String },
  status: {
    type: String,
    enum: ['requested', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'requested',
  },
  scheduledTime: { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)