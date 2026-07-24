 require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const Machine = require('./models/Machine')
const Booking = require('./models/Booking')
const User = require('./models/User')

const app = express()
connectDB()

app.use(cors())
app.use(express.json())

// Dynamic pricing calculator
const calculateDynamicPrice = async (basePrice, machineType, distanceKm) => {
  const distanceFactor = 1 + (distanceKm * 0.02)

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recentBookings = await Booking.countDocuments({
    createdAt: { $gte: oneDayAgo },
  })

  let demandFactor = 1
  if (recentBookings > 10) demandFactor = 1.3
  else if (recentBookings > 5) demandFactor = 1.15
  else if (recentBookings > 2) demandFactor = 1.05

  return Math.round(basePrice * distanceFactor * demandFactor)
}

// Login (find existing user or create new one)
app.post('/api/users/login', async (req, res) => {
  try {
    const { name, phone, role } = req.body
    if (!phone) return res.status(400).json({ error: 'Phone number zaroori hai' })

    let user = await User.findOne({ phone })
    if (!user) {
      user = await User.create({ name, phone, role: role || 'farmer' })
    }
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all available machines (with dynamic pricing)
app.get('/api/machines', async (req, res) => {
  try {
    const machines = await Machine.find({ available: true })

    const machinesWithDynamicPrice = await Promise.all(
      machines.map(async (m) => {
        const distanceKm = parseFloat(m.distance) || 0
        const dynamicPrice = await calculateDynamicPrice(m.price, m.type, distanceKm)
        return {
          ...m.toObject(),
          basePrice: m.price,
          price: dynamicPrice,
        }
      })
    )

    res.json(machinesWithDynamicPrice)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add a new machine
app.post('/api/machines', async (req, res) => {
  try {
    const { name, type, owner, ownerPhone, distance, price } = req.body
    const machine = await Machine.create({ name, type, owner, ownerPhone, distance, price })
    res.status(201).json(machine)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create a booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { machineId, farmerName, farmerPhone, workType, location } = req.body
    const booking = await Booking.create({
      machine: machineId,
      farmerName,
      farmerPhone,
      workType,
      location,
      status: 'requested',
    })
    res.status(201).json(booking)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all bookings for a farmer by phone number
app.get('/api/bookings/phone/:phone', async (req, res) => {
  try {
    const bookings = await Booking.find({ farmerPhone: req.params.phone })
      .populate('machine')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get ALL bookings (owner dashboard)
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('machine').sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single booking (tracking)
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('machine')
    if (!booking) return res.status(404).json({ error: 'Booking not found' })
    res.json(booking)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update booking status
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
    res.json(booking)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Trakto backend chal raha hai: http://localhost:${PORT}`)
})