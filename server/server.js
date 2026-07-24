require('dotenv').config()
const express = require('express')
// Dynamic pricing calculator
const calculateDynamicPrice = async (basePrice, machineType, distanceKm) => {
  // Distance factor: closer = cheaper, farther = slightly costlier
  const distanceFactor = 1 + (distanceKm * 0.02) // 2% increase per KM

  // Demand factor: check bookings in last 24 hours for this machine type
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recentBookings = await Booking.countDocuments({
    createdAt: { $gte: oneDayAgo },
  })

  let demandFactor = 1
  if (recentBookings > 10) demandFactor = 1.3
  else if (recentBookings > 5) demandFactor = 1.15
  else if (recentBookings > 2) demandFactor = 1.05

  const finalPrice = Math.round(basePrice * distanceFactor * demandFactor)
  return finalPrice
}
const cors = require('cors')
const connectDB = require('./config/db')
const Machine = require('./models/Machine')
const Booking = require('./models/Booking')

const app = express()
connectDB()

app.use(cors())
app.use(express.json())

// Get all available machines
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
    const machine = await Machine.create({
      name,
      type,
      owner,
      ownerPhone,
      distance,
      price,
    })
    res.status(201).json(machine)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create a booking (farmer requests a machine)
app.post('/api/bookings', async (req, res) => {
  ...


// Create a booking (farmer requests a machine)
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

// Get ALL bookings (for owner/admin dashboard)
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('machine')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single booking status (for tracking)
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('machine')
    if (!booking) return res.status(404).json({ error: 'Booking not found' })
    res.json(booking)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update booking status (assigned / in-progress / completed)
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    res.json(booking)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Trakto backend chal raha hai: http://localhost:${PORT}`)
})