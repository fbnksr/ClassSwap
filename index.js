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
app.get('/listClasses', (req, res) => {
  database.listClasses()
  .then(data => {
    res.send(JSON.stringify(data,null,4));
  })
  .catch(err=>{res.send({error:err})});
})
app.post('/addHasClasses', (req, res) => {
  database.appendHasUser(req.body)
  .then(data => {
    res.send(JSON.stringify(data,null,4));
  })
  .catch(err=>{res.send({error:err})});
})
app.post('/addWantsClasses', (req, res) => {
  database.appendWantsUser(req.body)
  .then(data => {
    res.send(JSON.stringify(data,null,4));
  })
  .catch(err=>{res.send({error:err})});
})
app.post('/remHasClasses', (req, res) => {
  database.removeHasUser(req.body)
  .then(data => {
    res.send(JSON.stringify(data,null,4));
  })
  .catch(err=>{res.send({error:err})});
})
app.post('/remWantsClasses', (req, res) => {
  database.removeWantsUser(req.body)
  .then(data => {
    res.send(JSON.stringify(data,null,4));
  })
  .catch(err=>{res.send({error:err})});
})




app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})
