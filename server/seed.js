require('dotenv').config()
const connectDB = require('./config/db')
const Machine = require('./models/Machine')

const machines = [
  { name: "Mahindra Tractor", type: "Tractor", owner: "Ramesh Kumar", distance: "2 KM", price: 850 },
  { name: "Sonalika Harvester", type: "Harvester", owner: "Suresh Singh", distance: "4 KM", price: 1200 },
  { name: "John Deere Sprayer", type: "Sprayer", owner: "Mahesh Yadav", distance: "1.5 KM", price: 600 },
]

const seed = async () => {
  await connectDB()
  await Machine.deleteMany()
  await Machine.insertMany(machines)
  console.log('Seed data inserted ✅')
  process.exit()
}

seed()