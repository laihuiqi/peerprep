const config = require('./config/config');
const express = require('express')
const mongoose = require('mongoose')
const questionRoutes = require('./routes/questions')

const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
  })

// go to question routes
app.use('/api/questions', questionRoutes)

// define port number
portNumber = 4000

// connect to database
mongoose.connect(config.mongodbUri)
    .then(() => {
        console.log('connected to database')
        app.listen(portNumber, () => {
        console.log('listening for requests on port', portNumber)
        })
    })
    .catch((err) => {
        console.log(err)
    }) 

module.exports = app;