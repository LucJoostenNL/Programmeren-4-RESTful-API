const logger = require('../CONFIG/app.config').logger
const database = require('../DATALAYER/mssql.dao')

    module.exports = {

        createReservationByApartmentID: (req, res, next) => {
            logger.info('POST /api/apartments/:id/reservations')

            logger.trace('Aanmaken nieuwe reservering')

            logger.debug(req.body)

            

            const query = "INSERT INTO [dbo].[Reservation](ApartmentId, StartDate, EndDate, [Status], UserId)" +
                `VALUES('${req.params.id}'` +
                ", '" + req.body.startDate + "'," +
                "'" + req.body.endDate + "'," +
                "'" + req.body.status + "'," +
                "'" + req.body.userId + "')";

                logger.info(query)
            database.executeQuery(query, (err, rows) => {
                // verwerk error of result
                const reservation = req.body;
                
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
            });
        },

        getReservationByApartmentID: (req, res, next) => {
            logger.info('GET /api/apartments/:id/reservations/')
    
            logger.trace('Ophalen reserveringen voor het appartement door gegeven appartementID')
    
            logger.debug(req.body)
        },
    
        getReservationByID: (req, res, next) => {
            logger.info('GET /api/apartments/:id/reservations/:id')
    
            logger.trace('Opvragen van een reservering door een gegeven ID')
    
            logger.debug(req.body)
        },
    
        updateReservationByID: (req, res, next) => {
            logger.info('PUT /api/apartments/:id/reservations/:id')
    
            logger.trace('Updaten van een reservering door een gegeven ID')
    
            logger.debug(req.body)
        },
    
        deleteReservationByID: (req, res, next) => {
            logger.info('DELETE /api/apartments/:id/reservations/:id')
    
            logger.trace('Verwijderen reservering door een gegeven ID')
    
            logger.debug(req.body)
        }

    }

    

