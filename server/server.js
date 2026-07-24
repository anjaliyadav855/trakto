const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/machines', (req, res) => {
  const machines = [
    { id: 1, name: "Mahindra Tractor", owner: "Ramesh Kumar", distance: "2 KM", price: 850 },
    { id: 2, name: "Sonalika Harvester", owner: "Suresh Singh", distance: "4 KM", price: 1200 },
    { id: 3, name: "John Deere Sprayer", owner: "Mahesh Yadav", distance: "1.5 KM", price: 600 },
  ]
  res.json(machines)
})

app.listen(5000, () => {
  console.log('Trakto backend chal raha hai: http://localhost:5000')
})