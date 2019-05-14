const logger = require('../CONFIG/app.config').logger
const database = require('../DATALAYER/mssql.dao')
const jwt = require('jsonwebtoken')
const assert = require('assert')
const secretkey = require('../CONFIG/app.config').secretKey
const validator = require('../VALIDATORS/user.validator')

// validators using RegularExpression
const phoneValidator = new RegExp('^06(| |-)[0-9]{8}$')
const nameValidator = new RegExp('^[a-zA-Z][a-z A-Z]*$')
const postalCodeValidator = new RegExp('^([0-9]{4}[ ]+[a-zA-Z]{2})$')
const emailAddressValidator = /^([a-zA-Z0-9_\-\.]+)@(gmail|hotmail|yahoo|live|outlook|avans)\.(com|nl|org|aus|be|de)$/;
//const emailAddressValidator = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

// constant variables to use for encryption with bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    register: (req, res, next) => {
        logger.trace('register user - POST aangeroepen!')

        const user = req.body
        logger.info(user)

        // try {
            
        //     assert.equal(typeof user.firstName, 'string', 'first name is required.')
        //     assert.equal(typeof user.lastName, 'string', 'last name is required.')
        //     assert.equal(typeof user.streetAddress, 'string', 'Street address is required.')
        //     assert.equal(typeof user.postalCode, 'string', 'Postal code is required.')
        //     assert.equal(typeof user.city, 'string', 'City is required.')
        //     assert.equal(typeof user.dateOfBirth, 'string', 'Date of birth is required.')
        //     assert.equal(typeof user.emailAddress, 'string', 'Email Address is required.')
        //     assert.equal(typeof user.password, 'string', 'Password is required.')

        //     assert(phoneValidator.test(user.phoneNumber), 'A valid phone number is required')


        // } catch (exception) {
        //     const errorObject = {
        //         message: 'Validation fails: ' + exception.toString(),
        //         code: 500
        //     }
        //     return next(errorObject)
        // }

        function validateUser() {
            validator.validateUser(user, (callback) => {
                if(callback != null) {
                    const errorObject = {
                        message: 'Validaiton failde due to: ' + callback.message.toString(),
                        code: 500
                    }
                    next(errorObject)
                    return;
                }
            })
        }
        

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
                    // Store hash in your password DB.

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
                            res.status(200).json(user)
                        }
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
        });

    },

    login: (req, res, next) => {
        logger.trace('register aangeroepen')
        function validateEmail(email) 
        {
            var re = /^([a-zA-Z0-9_\-\.]+)@(gmail|hotmail|yahoo|live|outlook|avans)\.(com|nl|org|aus|be|de)$/;
            //var re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
            return re.test(email);
        }

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