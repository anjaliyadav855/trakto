const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['farmer', 'owner'], default: 'farmer' },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)