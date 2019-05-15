const logger = require('../CONFIG/app.config').logger
const database = require('../DATALAYER/mssql.dao')
const jwt = require('jsonwebtoken')
const secretkey = require('../CONFIG/app.config').secretKey

// validators using RegularExpression
const phoneValidator = new RegExp('^06(| |-)[0-9]{8}$')
const nameValidator = new RegExp('^[a-zA-Z][a-z A-Z]*$')
const postalCodeValidator = new RegExp('^([0-9]{4}[ ]+[a-zA-Z]{2})$')
//const emailAddressValidator = /^([a-zA-Z0-9_\-\.]+)@(gmail|hotmail|yahoo|live|outlook|avans)\.(com|nl|org|aus|be|de)$/;
const emailAddressValidator = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
//const emailAddressValidator = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

// constant variables to use for encryption with bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    register: (req, res, next) => {
        logger.trace('register user - POST aangeroepen!')

        const user = req.body
        logger.info(user)

        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    const errorObject = {
                        message: 'Er ging iets mis met het hashen van het wachtwoord',
                        code: 500
                    }
                    next(errorObject);
                }

                if (hash) {

                    // check if firstname and lastname is valid
                    if (nameValidator.test(user.firstName) && nameValidator.test(user.lastName)) {

                        // check if postalcode is valid
                        if (postalCodeValidator.test(user.postalCode)) {

                            //check if phonenumber is valid
                            if (phoneValidator.test(user.phoneNumber)) {

                                // check if email address is valid
                                if (emailAddressValidator.test(user.emailAddress)) {

                                    const query = `INSERT INTO [DBUser] (FirstName, LastName, StreetAddress, PostalCode, City, DateOfBirth, PhoneNumber, EmailAddress, Password) VALUES (
                                        '${user.firstName}', 
                                        '${user.lastName}',
                                        '${user.streetAddress}',
                                        '${user.postalCode}',
                                        '${user.city}',
                                        '${user.dateOfBirth}',
                                        '${user.phoneNumber}',
                                        '${user.emailAddress}',
                                        '${hash}'); 
                                        SELECT SCOPE_IDENTITY() AS UserId`;

                                    database.executeQuery(query, (err, rows) => {
                                        if (err) {
                                            const errorObject = {
                                                message: 'Er is iets misgegaan in de database',
                                                code: 500
                                            }
                                            next(errorObject)
                                        }
                                        if (rows) {
                                            logger.trace(rows.recordset)
                                            res.status(200).json({
                                                Result: rows.recordset[0],
                                                code: 200
                                                })
                                        }
                                    })
                                } else {
                                    const errorObject = {
                                        message: 'Email address missing or invalid || format example: xxxxx@gmail.com / xxxxxxx@outlook.com',
                                        code: 406
                                    }
                                    logger.error(errorObject);
                                    next(errorObject);
                                }
                            } else {
                                const errorObject = {
                                    message: 'Phonenumber missing or invalid || format example: 06-xxxxxxxx / 06xxxxxxxx / 06 xxxxxxxx',
                                    code: 406
                                }
                                logger.error(errorObject);
                                next(errorObject);
                            }
                        } else {
                            const errorObject = {
                                message: 'Postalcode missing or invalid || format example: xxxx PK / xxxxPK',
                                code: 406
                            }
                            logger.error(errorObject);
                            next(errorObject);
                        }
                    } else {
                        const errorObject = {
                            message: 'First name missing or invalid - Last name missing or invalid - both are invalid or missing || format example: xxx Joosten / Gerard xxxxx',
                            code: 406
                        }
                        logger.error(errorObject);
                        next(errorObject);
                    }
                } else {
                        const error = {
                            message: "Password hash is false",
                            code: 406
                        }
                        logger.error(error);
                        next(error);
                    }
            });
        });
    },

    login: (req, res, next) => {
        logger.trace('register aangeroepen')

        logger.warn(validateEmail(req.body.emailAddress))

        // req.body uitlezen, geeft user data
        const user = req.body
        logger.trace('user: ', user)

        // query samenstellen met user data
        const query = `SELECT UserId, Password FROM [DBUser] WHERE EmailAddress = '${user.emailAddress}'`
        logger.trace(query)

        // Query aanroepen op de database
        database.executeQuery(query, (err, rows) => {
            if (err) {
                const errorObject = {
                    message: 'Er ging iets mis in de database.',
                    code: 500
                }
                next(errorObject)
            }
            if (rows) {
                // Als we hier zijn:
                if (rows.recordset.length === 0) {
                    // User niet gevonden, email adress bestaat niet
                    logger.warn("no result! Did not found a matching user")
                    res.status(401).json({
                        result: 'No results!',
                        code: 401
                    })
                } else {
                    /* password decrypten zodat het password vergeleken kan worden */

                    bcrypt.compare(req.body.password, rows.recordset[0].Password, (err, response) => {
                        if (err) {
                            const errorObject = {
                                message: err.message.toString(),
                                code: 500
                            }
                            next(errorObject)
                        }

                        if (response) {
                            const id = rows.recordset[0].UserId
                            logger.debug(`Password match, user with id: ${id} is logged in!`)
                            logger.trace(rows.recordset)

                            const payload = {
                                UserId: rows.recordset[0].UserId
                            }

                            // user bestaat en geldig wachtwoord --> JSON token (JWT)
                            jwt.sign({
                                data: payload
                            }, 'secretkey', {
                                expiresIn: '7d'
                            }, (err, token) => {
                                if (err) {
                                    logger.error('Kon geen JWT genereren')
                                    const errorObject = {
                                        message: 'Kon geen JWT genereren.',
                                        code: 500
                                    }
                                    next(errorObject)
                                }
                                if (token) {
                                    logger.info('Token generatie is een succes!')
                                    res.status(200).json({
                                        result: {
                                            token: token
                                        }
                                    })
                                }
                            })
                        } else {
                            logger.warn('Password DO NOT match!')
                            res.status(401).json({
                                result: "Password DO NOT match!"
                            })
                        }

                    })
                }
            }
        })
    },



    validateToken: (req, res, next) => {
        logger.trace('validateToken aangeroepen')
        // logger.debug(req.headers)
        const authHeader = req.headers.authorization
        if (!authHeader) {
            errorObject = {
                message: 'Authorization header missing!',
                code: 401
            }
            logger.warn('Validate token failed: ', errorObject.message)
            return next(errorObject)
        }
        const token = authHeader.substring(7, authHeader.length)

        jwt.verify(token, 'secretkey', (err, payload) => {
            logger.debug(payload)
            if (err) {
                logger.debug(err)
                errorObject = {
                    message: 'not authorized',
                    code: 401
                }
                logger.warn('Validate token failed: ', errorObject.message)
                next(errorObject)
            }
            if (payload) {
                logger.debug('token is valid', payload)
                // User heeft toegang. Voeg UserId uit payload toe aan
                // request, voor ieder volgend endpoint.
                req.user = payload.data
                next()
            }
        })
    },

    getAll: (req, res, next) => {
        logger.trace('getAll aangeroepen')

        // query samenstellen met user data
        const query = `SELECT * FROM [DBUser]`

        // Query aanroepen op de database
        database.executeQuery(query, (err, rows) => {
            if (err) {
                logger.error('De query kon niet worden uitgevoerd!')
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

    getUserByID: (req, res, next) => {
        logger.trace('getUserByID aangeroepen!')

        // getting the inserted id value from the url
        const id = req.params.id

        // samenstellen query om een user terug te krijgen
        const query = `SELECT * FROM [DBUser] WHERE UserId = ${id}`

        // Query aanroepen op de database
        database.executeQuery(query, (err, rows) => {
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