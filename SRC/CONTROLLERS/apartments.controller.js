const logger = require('../CONFIG/app.config').logger
const database = require('../DATALAYER/mssql.dao')

module.exports = {
    getAppartments: (req, res, next) => {
        logger.info('GET /api/apartments aangeroepen!')

        logger.trace('Appartement info is opgevraagd')

        const query = "SELECT * FROM Apartment;"

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
            }
        });
    },

    createAppartment: (req, res, next) => {
        logger.info('POST /api/apartments aangeroepen!')

        logger.trace("Creating a new apartment into the database")
        logger.trace(req.body);

        const query = "INSERT INTO Apartment('Description', 'StreetAddress', 'PostalCode', 'City', 'UserId')" +
            "VALUES('" +
            req.body.description +
            "','" +
            req.body.streetAddress +
            "','" +
            req.body.postalCode +
            "','" +
            req.body.city +
            "','" +
            req.body.userId + "');"

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
            }
        });
    },

    getApartmentByID: (req, res, next) => {
        logger.info('GET /api/apartments/:id aangeroepen!')
        const id = req.params.id

        const query = `SELECT * FROM Apartment WHERE ApartmentId = ${id};`
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
            }
        });
    },

    updateApartmentByID: (req, res, next) => {
        logger.info('PUT /api/apartments/:id aangeroepen!')
        const id = req.params.id

        logger.trace(req.body)

        const query = `UPDATE Apartment SET Description = '${req.body.description}', 
          StreetAddress = '${req.body.streetAddress}', PostalCode = '${req.body.postalCode}',
          City = '${req.body.city}', UserId = ${req.body.userId} WHERE ApartmentId = ${id}`
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
            } else {
                const error = {
                    message: "Apartment with ID: " + id + " not found!",
                    code: 404
                }
                logger.error(error);
                next(error);
            }
        });
    },

    deleteApartmentByID: (req, res, next) => {
        logger.info('DELETE /api/apartments/:id aangeroepen!')
        const id = req.params.id

        const query = `DELETE FROM Apartment WHERE ApartmentId = ${id}`
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
            } else {
                const error = {
                    message: "Apartment with ID: " + id + " not found!",
                    code: 404
                }
                logger.error(error);
                next(error);
            }
        });
    }
}