const express = require('express');
const logger = require('./SRC/CONFIG/app.config').logger
const bodyparser = require('body-parser');

const appartmentRentalRoutes = require("./SRC/ROUTES/appartments.routs");
const reservationRoutes= require("./SRC/ROUTES/reservations.routes");

const app = express()
const port = process.env.PORT || 2019

// Hier installeren we de routes
app.use('/api/appartments', appartmentRentalRoutes)
//app.use('/api/appartments', reservationRoutes)

// Generic endpoint handler - voor alle routes
app.all('*', (req, res, next) => {
    // logger.info('Generieke afhandeling aangeroepen!')
    // ES16 deconstructuring
    const { method, url } = req
    logger.info(`${method} ${url}`)
    next()
  })
  
 // Handle endpoint not found.
  app.all('*', (req, res, next) => {
    logger.error('Endpoint not found.')
    const errorObject = {
      message: 'Endpoint does not exist!',
      code: 404,
      date: new Date()
    }
    next(errorObject)
  })
  
  // Error handler
  app.use((error, req, res, next) => {
    logger.error('Error handler: ', error.message.toString())
    res.status(error.code).json(error)
  })
  
  app.listen(port, () => logger.info(`Apartment rental app listening on port ${port}!`))

  app.use(bodyparser.json())


  module.exports = app