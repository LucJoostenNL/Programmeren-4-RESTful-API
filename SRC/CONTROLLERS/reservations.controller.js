const logger = require('../CONFIG/app.config').logger
const database = require('../DATALAYER/mssql.dao')

module.exports = {
  createReservationByApartmentID: (req, res, next) => {
    logger.info('POST /api/apartments/:id/reservations')
    logger.trace('Aanmaken nieuwe reservering')

    const query =
      'INSERT INTO [dbo].[Reservation](ApartmentId, StartDate, EndDate, [Status], UserId)' +
      `VALUES('${req.params.id}'` + ", '" +
      req.body.startDate + "', '" +
      req.body.endDate + "', '" +
      req.body.status + "', '" +
      req.user.UserId + "')"

    logger.info(query)

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    const currentDate = new Date();

    if(startDate >= currentDate) {
    if (startDate < endDate) {
      database.executeQuery(query, (err, rows) => {
        // verwerk error of result
        const reservation = req.body

        if (err) {
          const errorObject = {
            message: 'Er ging iets mis in de database.',
            code: 500
          }
          next(errorObject)
        }
        if (rows) {
          logger.trace(rows.recordset)
          res.status(200).json(reservation)
        }
      })
    } else {
      res.status(400).json({
        Result: 'De datum die is ingegeven is niet correct, datum kan niet eindigen voor de begin datum',
        code: 400
      })
    }
  } else {
    res.status(400).json({
      Result: 'De startdatum is niet valide. Startdatum moet gelijk of groter (ouder) zijn dan de huidige datum',
      code: 400
    })
  }
  },

  getReservationByApartmentID: (req, res, next) => {
    logger.info('GET /api/apartments/:id/reservations/')
    logger.trace('Ophalen reservering op apartment ID')

    const query = 'SELECT * FROM [dbo].[Reservation] WHERE ApartmentId = ' + req.params.id
    logger.trace(query)

    logger.trace('Ophalen reserveringen voor het appartement door gegeven appartementID')
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200).json({
          result: rows.recordset
        })
        logger.debug(rows.recordset)
      }
    })
  },

  getReservationByID: (req, res, next) => {
    logger.info('GET /api/apartments/:id/reservations/:resId')
    logger.trace('Ophalen van reservering ID op appartment ID')

    const query =
      'SELECT * FROM [dbo].[Reservation] WHERE ApartmentId = ' +
      req.params.id +
      ' AND ReservationId = ' +
      req.params.resId
    logger.trace(query)

    logger.trace('Opvragen van een reservering door een gegeven ID')
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200).json({
          result: rows.recordset
        })
        logger.debug(rows.recordset)
      }
    })
  },

  updateReservationByID: (req, res, next) => {
    logger.info('PUT /api/apartments/:id/reservations/:userId')
    logger.trace('Updaten van een reservering door een gegeven ID')

    // Create query
    const query =
      "UPDATE Reservation SET Status = '" +
      req.body.status +
      "' WHERE ApartmentId = " +
      req.params.appId +
      ' AND ReservationId = ' +
      req.params.resId +
      ' AND UserId = ' +
      req.user.UserId
    logger.trace(query)

    logger.trace('Wijzigen van status appartement, Aleen  eigenaar van het appartement kan een reserveringsstatus wijzigen')


    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200).json({
          result: rows.recordset
        })
        logger.debug(rows.recordset)
      }
    })
  },

  deleteReservationByID: (req, res, next) => {
    logger.info('DELETE /api/apartments/:id/reservations/:id')
    logger.trace('Meld de gegeven deelnemer af voor deze activiteit')

    // Create query
    const query = "DELETE FROM Reservation WHERE ApartmentId = " + req.params.appId + " AND ReservationId = " + req.params.resId + " AND UserId = " + req.user.UserId;
    logger.trace(query)

    logger.trace('Verwijderen reservering door een gegeven ID')
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200).json({
          result: rows.recordset
        })
        logger.debug(rows.recordset)
      }
    })
  }
}