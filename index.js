const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database')
const app = express()
app.use(express.static('public'))

app.use(bodyParser.json())
app.post('/createUser', (req, res) => {
  database.addUser(req.body.fname,req.body.lname,req.body.email,req.body.password)
  .then(data => {
    res.send(JSON.stringify(data,null,4));
  })
  .catch(err=>{res.send({error:err})});
})
app.post('/login', (req, res) => {
  database.validateUser(req.body.email,req.body.password)
  .then(data => {
    res.send(JSON.stringify(data,null,4));
  })
  .catch(err=>{res.send({error:err})});
})
app.get('/getClasses', (req, res) => {
  database.getClasses()
  .then(data => {
    res.send(JSON.stringify(data,null,4));
  })
  .catch(err=>{res.send({error:err})});
})
app.get('/addHasClasses', (req, res) => {
  database.appendHasUser()
  .then(data => {
    res.send(JSON.stringify(data,null,4));
  })
  .catch(err=>{res.send({error:err})});
})
app.get('/addWantsClasses', (req, res) => {
  database.appendWantsUser()
  .then(data => {
    res.send(JSON.stringify(data,null,4));
  })
  .catch(err=>{res.send({error:err})});
})
app.get('/remHasClasses', (req, res) => {
  database.removeHasUser()
  .then(data => {
    res.send(JSON.stringify(data,null,4));
  })
  .catch(err=>{res.send({error:err})});
})
app.get('/remWantsClasses', (req, res) => {
  database.removeWantsUser()
  .then(data => {
    res.send(JSON.stringify(data,null,4));
  })
  .catch(err=>{res.send({error:err})});
})




app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})
