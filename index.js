const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')
const database = require('./database')
const app = express()
app.use(express.static('public'))

app.use(bodyParser.json())
app.post('/createUser', (req, res) => {
  database.addUser(req.body.username,req.body.password)
})
app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})
