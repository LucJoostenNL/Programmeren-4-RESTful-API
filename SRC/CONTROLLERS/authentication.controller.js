const logger = require('../CONFIG/app.config').logger
const database = require('../DATALAYER/mssql.dao')
const jwt = require('jsonwebtoken')

// validators using RegularExpression
// checken of de string begint met 06, niks/een spatie/streepje vervolgd en of de 8 op een volgende getallen tussen de 0 en de 9 zijn
const phoneValidator = new RegExp('^06(| |-)[0-9]{8}$')

// checken of de voornaam en achternaam de letters tussen a t/m z bevatten ook in hoofdletters, en checken of er een spatie tussen zit
const nameValidator = new RegExp('^[a-zA-Z][a-z A-Z]*$')

// checken of de string eerst 4 cijfers bevat tussen de 0 en 9 en wordt vervolgd (met spatie) door 2 letters tussen de letter a en z
// in zowel kleine letters als hoofdletters
const postalCodeValidator = new RegExp('^([0-9]{4}[ ]+[a-zA-Z]{2})$')

// checken of het email adres begint met characters a t/m z of 0 t/m 9, of het een _ / - of . bevat en een @
// na de @ kijken of het met gmail, hotmail ect eindigt
const emailAddressValidator = /^([a-zA-Z0-9_\-\.]+)@(gmail|hotmail|yahoo|live|outlook|avans)\.(com|nl|org|aus|be|de)$/
//const emailAddressValidator = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

// constant variables to use for encryption with bcrypt
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {
  register: (req, res, next) => {
    logger.trace('register user - POST aangeroepen!')

    // body opvragen
    const user = req.body
    //logger.info(user)

    // gentSalt functie voor het genereren van een salt die radom aangemaakt wordt en aan het ingevoerde wachtwoord wordt geplakt
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        // als er een error optreedt wordt er een errorObject geresulteert met een message en code 500
        const errorObject = {
          message: err.message.toString(),
          code: 500
        }
        next(errorObject)
      }
      // wanneer er geen error optreedt roepen we de functie hash aan om het ingevoerde wachtwoord + salt te hashen
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          const errorObject = {
            message: 'Er ging iets mis met het hashen van het wachtwoord',
            code: 500
          }
          next(errorObject)
        }

        // als de hash gelukt is wordt er gebruik gemaakt van reguliere expressies om de validatie van de ingevoerde waarden te controleren
        if (hash) {
          // check if firstname and lastname is valid
          if (nameValidator.test(user.firstName) && nameValidator.test(user.lastName)) {
            // check if postalcode is valid
            if (postalCodeValidator.test(user.postalCode)) {
              //check if phonenumber is valid
              if (phoneValidator.test(user.phoneNumber)) {
                // check if email address is valid
                if (emailAddressValidator.test(user.emailAddress)) {
                  // de validatie gelukt is wordt er een query opgesteld om de waarden toe te voegen in de database
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
                                        SELECT SCOPE_IDENTITY() AS UserId`

                  // het uitvoeren van de query
                  database.executeQuery(query, (err, rows) => {
                    if (err) {
                      const errorObject = {
                        message: 'Er is iets misgegaan in de database',
                        code: 500
                      }
                      next(errorObject)
                    }
                    // als rows true is geven we de status 200 mee aan res en laten we het record set returnen
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
                    message:
                      'Email address missing or invalid || format example: xxxxx@gmail.com / xxxxxxx@outlook.com',
                    code: 406
                  }
                  logger.error(errorObject)
                  next(errorObject)
                }
              } else {
                const errorObject = {
                  message:
                    'Phonenumber missing or invalid || format example: 06-xxxxxxxx / 06xxxxxxxx / 06 xxxxxxxx',
                  code: 406
                }
                logger.error(errorObject)
                next(errorObject)
              }
            } else {
              const errorObject = {
                message: 'Postalcode missing or invalid || format example: xxxx PK / xxxxPK',
                code: 406
              }
              logger.error(errorObject)
              next(errorObject)
            }
          } else {
            const errorObject = {
              message:
                'First name missing or invalid - Last name missing or invalid - both are invalid or missing || format example: xxx Joosten / Gerard xxxxx',
              code: 406
            }
            logger.error(errorObject)
            next(errorObject)
          }
        } else {
          const error = {
            message: 'Password hash is false',
            code: 406
          }
          logger.error(error)
          next(error)
        }
      })
    })
  },

  login: (req, res, next) => {
    logger.trace('register aangeroepen')

    logger.warn(req.body.emailAddress)

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
      // als rows true is gaan we verder
      if (rows) {
        // Als we hier zijn gaan we kijken of het resultaat een lengte heeft van 0
        // is dit het geval dan geven we de response een status 401
        if (rows.recordset.length === 0) {
          // User niet gevonden, email adress bestaat niet
          logger.warn('no result! Did not found a matching user')
          res.status(401).json({
            result: 'No results!',
            code: 401
          })
        } else {
          /* password decrypten zodat het password vergeleken kan worden */
          // het ingevoerde wachtwoord wordt vergeleken met het opgeslagen wachtwoord uit de database op de recordset die binnen komt
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
              // als response true is dan geven we de constante payload een waarde, namelijk het UserId. dit is nodig om verdere afhandelingen
              // te kunnen verrichten anders ben je niet geautoriseerd
              const payload = {
                UserId: rows.recordset[0].UserId
              }

              // user bestaat en geldig wachtwoord --> JSON token (JWT)
              // nu gaan we de user daadwerkelijk laten inloggen door de payload (userID) mee te geven in het jwt token die 7 dagen geldig is
              jwt.sign({ data: payload }, 'secretkey', { expiresIn: '7d' }, (err, token) => {
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
              // bestaat het ingevoerde email adres wel in de database, maar komt het wachtwoord niet overeen;
              // dan geven we de response een status 401 met een resultaat message dat het wachtwoord niet overeen komt met die is opgeslagen
              // in de database
              logger.warn('Password DO NOT match!')
              res.status(401).json({
                result: 'Password DO NOT match!'
              })
            }
          })
        }
      }
    })
  },

  // valideren van het token uit de header van postman, is de value verkeerd of is de value leeg, dan geven we een resultaat dat
  // de user niet geautoriseerd is om deze actie uit te voeren / geen recht heeft
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

  // alle users als resultaat terug krijgen vanuit de database
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
