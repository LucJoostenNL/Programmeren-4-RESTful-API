const logger = require('../CONFIG/app.config').logger
const database = require('../DATALAYER/mssql.dao')

module.exports = {
    getAppartments: (req, res, next) => {
        logger.info('GET /api/appartments aangeroepen!')

        logger.trace('Appartment info is asked')

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
        })
    },

    createAppartment: (req, res, next) => {
        logger.info('POST /api/appartments aangeroepen!')

        const apartment = req.body

        logger.trace(apartment)

        const query = "INSERT INTO Apartment('Description', 'StreetAddress', 'PostalCode', 'City', 'UserId')" +
            "VALUES('" +
            apartment.description +
            "','" +
            apartment.streetAddress +
            "','" +
            apartment.postalCode +
            "','" +
            apartment.city +
            "','" +
            apartment.userId + "'"

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
        })
    }
}