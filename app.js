const express = require('express')
const mongoose = require('mongoose')
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Parse request body
app.use(express.json());

// Configure DB connection
require('dotenv').config()

// Handles POSTs
app.use('/users', require('./routes/users'));

app.use('/sessions', require('./routes/sessions'));

// Establishes connection to DB
mongoose.connect(process.env.MONGODB_URL, (err) => {
    if (err) throw Error
    console.log("Connected to Mongo")
})

// Listens for connections
app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})