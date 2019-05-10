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

    createAppartment: function (req, res, next) {
        logger.info('POST /api/appartments aangeroepen!')

        logger.trace("Creating a new apartment into the database")

        logger.trace(req.query);

        const query = "INSERT INTO [dbo].Apartment('Description', 'StreetAddress', 'PostalCode', 'City', 'UserId')" +
            "VALUES('" +
            req.query.description +
            "','" +
            req.query.streetAddress +
            "','" +
            req.query.postalCode +
            "','" +
            req.query.city +
            "','" +
            req.query.userId + "');"

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

    test: function (req, res, next) {
        console.log(req.body)
        res.status(200).json(req.body);
    }
}