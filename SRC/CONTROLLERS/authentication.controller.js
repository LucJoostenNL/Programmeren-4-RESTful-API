const logger = require('../CONFIG/app.config').logger
const database = require('../DATALAYER/mssql.dao')
const jwt = require('jsonwebtoken')

module.exports = {
    register: (req, res, next) => {
      logger.trace('register aangeroepen')
  
      // req.body uitlezen, geeft user data
      // - valideer de juistheid
      const user = req.body
      logger.trace('user: ', user)
  
      // INSERT query samenstellen met user data
      const query =
        `INSERT INTO [DBUser] (FirstName, LastName, StreetAddress, ` +
        `PostalCode, City, DateOfBirth, PhoneNumber, EmailAddress, Password) ` +
        ` VALUES('${user.firstName}', '${user.lastName}', ` +
        `'${user.streetAddress}', '${user.postalCode}', '${user.city}', ` +
        `'${user.dateOfBirth}', '${user.phoneNumber}', '${user.emailAddress}', ` +
        `'${user.password}'); SELECT SCOPE_IDENTITY() AS UserId`
      logger.trace(query)
  
      // Query aanroepen op de database
      database.executeQuery(query, (err, rows) => {
        if (err) {
          const errorObject = {
            message: 'Er ging iets mis in de database.',
            sql: {
              message: err.message,
              code: err.code
            },
            code: 500
          }
          next(errorObject)
        }
        if (rows) {

          // User geregistreerd, retourneer het UserId
          res.status(200).json({ result: rows.recordset[0] })
        }
      })
    }
}