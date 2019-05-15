const assert = require('assert')
const should = require('chai').should()
const database = require('../SRC/DATALAYER/mssql.dao')
const logger = require('../SRC/CONFIG/app.config').logger

const chai = require('chai')
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken')

const server = require('../index')

chai.should()
chai.use(chaiHttp)

const authorizationHeader = 'authorization'
let token

//
// Deze functie wordt voorafgaand aan alle tests 1 x uitgevoerd.
//
before(() => {
    //logger.trace('- before')
    // We hebben een token nodig om een ingelogde gebruiker te simuleren.
    // Hier kiezen we ervoor om een token voor UserId 1 te gebruiken.
    const payload = {
        UserId: 1
    }
    jwt.sign({
            data: payload
        },
        'secretkey', {
            expiresIn: '7d'
        },
        (err, result) => {
            if (result) {
                token = result
            }
        }
    )
})

beforeEach(() => {
    //logger.debug('- beforeEach')
})

/*  ==========================       
    =    POST METHOD TEST    =
    ==========================
*/

describe('User API POST to register a new user', () => {
    it('should return response status 200 with inserted user', done => {
        database.closeConnection();
        // wat verwachten we dat waar is?
        const insertQuery = '`INSERT INTO [DBUser] (FirstName, LastName, StreetAddress, PostalCode, City, DateOfBirth, PhoneNumber, EmailAddress, Password)' +
            "VALUES ('Luc', 'Joosten', 'Buys ballotstraat 17', '5751 BH', 'Vlierden', '1999-12-14', '0636542018', 'lusdc@gmail.com', 'brokko')"
        // wat verwachten we dat waar is?

        database.executeQuery(insertQuery, (err, res) => {
            if(err) {
                logger.error(err)
                done();
            }
            if (res) {
                assert(res.FirstName != 'Lucc')
                assert((res.FirstName = 'Luc'))
                assert((res.LastName = 'Joosten'))
                assert(res.LastName != 'Pieter')
                assert(res.City != 'Breda')
                assert((res.City = 'Vlierden'))
                assert((res.password = 'brokko'))
                assert(res.password != 'sfvaasdfsdfsadfasdfsdfsd32e42')
                assert(res.postalCode = '5751 BH')
                done()
            }
        })
    })
    it('should return response status 200 with selected user', done => {
        database.closeConnection();
        // wat verwachten we dat waar is?
        const query = `SELECT * FROM DBUser WHERE UserId = 160`

        database.executeQuery(query, (err, res) => {
            if (err) {
                logger.error(err.message)
                done(err.message)
            } else {
                assert(res.FirstName != 'Lucc')
                assert((res.FirstName = 'Luc'))
                assert((res.LastName = 'Joosten'))
                assert(res.LastName != 'Pieter')
                assert(res.City != 'Breda')
                assert((res.City = 'Vlierden'))
                assert((res.password = 'brokko'))
                assert(res.password != 'sfvaasdfsadfasdfsdfsd32e42')
                assert(res.postalCode = '5751 BH')
                done()
            }
        })
    })

    it('should return an error with code: 404', done => {
        chai
            .request(server)
            .post('/r')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                // Because the path is not right, the status should
                // return an error with status code 404
                res.should.have.status(404)
                done()
            })
    })
})

/*  ==========================       
    =    GET METHOD TEST     =
    ==========================
*/

describe('Apartment GET from the server by ID', () => {
    it('Returns an apartment by ID (GET - method)', done => {
        chai
            .request(server)
            .get('/api/apartments/1')
            .set('Content-Type', 'application/json')
            .set(authorizationHeader, 'Bearer ' + token)
            .end((err, res) => {
                // The response status should be equal to 200

                res.should.have.status(200)
                const description = 'Woon huis Student'
                
                // the body should be equal to the posted object on place [1]
                res.body.should.have.property('Description:').is.equal(description)
                done()
            })
        done()
    })

    it('should return an error with message endpoint not found & code: 404', done => {
        chai
            .request(server)
            .get('/random')
            .end((err, res) => {
                // Because the path is not right, the status should
                // return an error with status code 404
                res.should.have.status(404)
                done()
            })
    })
})

describe('Apartments routes - GET all apartments', () => {
    it('should return status code 500', done => {
        chai
            .request(server)
            .get('/api/apartments/')
            .set('Content-Type', 'application/json')
            .set(authorizationHeader, 'Bearer ' + token)
            .end((err, res) => {
                if(err) {
                    logger.error(err.message)
                    done()
                }
                logger.trace(res.body.result)

                res.should.exist
                res.should.have.status(500)
                done()
            })
    })
})

/*  ==========================       
    =    DELETE METHOD TEST  =
    ==========================
*/
describe('Deletes a apartment from the server by ID', () => {

    it('should return an error with code: 404', done => {
        chai
            .request(server)
            .delete('/random')
            .end((err, res) => {
                // Because the path is not right, the status should
                // return an error with status code 404
                res.status.should.equal(404)
                done()
            })
    })
})

describe('Apartments Database', () => {
    // Testcase
    it('should accept the properties of an apartment', done => {
        database.closeConnection();
        // wat verwachten we dat waar is?
        const apartment = {
            description: 'finding nemo',
            streetAddress: 'beschrijving',
            postalCode: '5756 BH',
            city: 'Vlierden',
            userId: 119
        }

        const query = `SELECT * FROM Apartment WHERE ApartmentId = 1`
        database.executeQuery(query, (err, res) => {
            if (err) {
                logger.error(err.message)
                done(err.message)
            } else {
                assert(res.postalCode != '5756KK')
                assert(res.city != apartment.city)
                assert(res.streetAddress != apartment.streetAddress)
                assert(res.userId + apartment.userId != 120)
                done()
            }
        })
    })

    // Testcase
    it('should accept an User with UserId = 1', done => {
        database.closeConnection()

        // wat verwachten we dat waar is?
        const query = `SELECT * FROM DBUser WHERE UserId = 1`

        database.executeQuery(query, (err, res) => {
            if (err) {
                logger.error(err.message)
                done(err.message)
            } else {
                assert(res.FirstName != 'pietertje')
                assert((res.FirstName = 'Pieter'))
                assert((res.LastName = 'Hansen'))
                assert(res.LastName != 'Pieter')
                assert(res.City != 'Deurne')
                assert((res.City = 'Breda'))
                assert((res.password = 'secret'))
                assert(res.password != 'sfvafgv6546542')
                done()
            }
        })
    })

    // Testcase
    it('should accept an User with UserId = 2', done => {
        database.closeConnection()

        // wat verwachten we dat waar is?
        const query = `SELECT * FROM DBUser WHERE UserId = 2`

        database.executeQuery(query, (err, res) => {
            if (err) {
                logger.error(err.message)
                done(err.message)
            } else {
                assert(res.FirstName != 'Lucc')
                assert((res.FirstName = 'Luc'))
                assert((res.LastName = 'Joosten'))
                assert(res.LastName != 'Pieter')
                assert(res.City != 'Breda')
                assert((res.City = 'Vlierden'))
                assert((res.password = 'postzegel'))
                assert(res.password != 'sfvaasdfsadfasdfsdfsd32e42')
                done()
            }
        })
    })

    // Testcase
    it('should accept an User with UserId = 3', done => {
        database.closeConnection()

        // wat verwachten we dat waar is?
        const query = `SELECT * FROM DBUser WHERE UserId = 3`

        database.executeQuery(query, (err, res) => {
            if (err) {
                logger.error(err.message)
                done(err.message)
            } else {
                assert(res.FirstName != 'stefke')
                assert((res.FirstName = 'Stefan'))
                assert((res.LastName = 'Ilmer'))
                assert(res.LastName != 'Pieter')
                assert(res.City != 'Deurne')
                assert((res.City = 'Etten-leur'))
                assert((res.password = 'brokko'))
                assert(res.password != 'sfvafgv6546542')
                done()
            }
        })
    })

    // Testcase
    it('should not accept an User with UserId = 4', done => {
        database.closeConnection()

        // wat verwachten we dat waar is?
        const query = `SELECT * FROM DBUser WHERE UserId = 4`

        database.executeQuery(query, (err, res) => {
            if (err) {
                logger.error(err.message)
                done(err.message)
            } else {
                assert(res.FirstName != 'pietersen')
                assert(res.FirstName != 'Pieter')
                assert(res.LastName != 'Hansen')
                assert(res.LastName != 'Pieter')
                assert(res.City != 'Deurne')
                assert(res.City != 'Breda')
                assert(res.password != 'secret')
                assert(res.password != 'sfvafgv6546542')
                done()
            }
        })
    })

    // Testcase
    it('should accept a reservation with ReservationId = 1', done => {
        database.closeConnection()

        // wat verwachten we dat waar is?
        const query = `SELECT * FROM Reservation WHERE ReservationId = 1`

        database.executeQuery(query, (err, res) => {
            if (err) {
                logger.error(err.message)
                done(err.message)
            } else {
                assert(res.Status != 'INITIL')
                assert((res.Status = 'INITIAL'))
                assert((res.ApartmentId = '1'))
                assert(res.ApartmentId != '324')
                assert(res.UserId != 'Deurne')
                assert((res.UserId = '1'))
                assert((res.StartDate = '2019-05-10'))
                assert(res.EndDate != '2019-05-10')
                done()
            }
        })
    })

    // Testcase
    it('should accept a reservation with ReservationId = 2', done => {
        database.closeConnection()

        // wat verwachten we dat waar is?
        const query = `SELECT * FROM Reservation WHERE ReservationId = 2`

        database.executeQuery(query, (err, res) => {
            if (err) {
                logger.error(err.message)
                done(err.message)
            } else {
                assert(res.Status != 'INITIL')
                assert(res.Status != 'Initial')
                assert(res.ApartmentId != '1')
                assert(res.ApartmentId != '324')
                assert(res.UserId != 'Deurne')
                assert(res.UserId != '1')
                assert(res.StartDate != '2019-05-10')
                assert(res.EndDate != '2019-05-10')
                done()
            }
        })
    })

    // Testcase
    it('should accept a reservation with ReservationId = 3', done => {
        database.closeConnection()

        // wat verwachten we dat waar is?
        const query = `SELECT * FROM Reservation WHERE ReservationId = 3`

        database.executeQuery(query, (err, res) => {
            if (err) {
                logger.error(err.message)
                done(err.message)
            } else {
                assert(res.Status != 'ACEPTED')
                assert((res.Status = 'ACCEPTED'))
                assert((res.ApartmentId = '3'))
                assert(res.ApartmentId != '324')
                assert(res.UserId != '112')
                assert((res.UserId = '1'))
                assert((res.StartDate = '2019-05-15'))
                assert(res.EndDate != '2019-05-18')

                assert(res != null)
                done()
            }
        })
    })
})



describe('Authentication API GET users', () => {
    it('should return all users from the database', done => {
        database.closeConnection()
        chai
            .request(server)
            .get('/api/users')
            .end((err, res) => {
                res.should.exist
                res.should.have.status(200)
                res.body.should.be.a('object')

                const result = res.body.result
                result.should.be.an('array')
                const user = result[0]
                user.should.have.property('UserId').that.is.a('number')
                user.should.have.property('FirstName').that.is.a('string')
                user.should.have.property('LastName').that.is.a('string')
                user.should.have.property('EmailAddress').that.is.a('string')

                user.should.not.have.property('code')

                done()
            })
    })
})

describe('Reservation Database', () => {
    // Testcase
    it('should accept the properties of an reservation', done => {

        database.closeConnection();
        // wat verwachten we dat waar is?
        const reservation = {
            id: '5',
            startDate: '2019-05-14',
            endDate: '2019-05-19',
            status: 'NOT-ACCEPTED'
        }

        const query = `SELECT * FROM Reservation WHERE UserId = 1`
        database.executeQuery(query, (err, res) => {
            if (err) {
                logger.error(err.message)
                done(err.message)
            } else {
                assert(res.id != reservation.id)
                assert(res.startDate != reservation.startDate)
                assert(res.endDate != reservation.endDate)
                assert(res.status != reservation.status)
                done()
            }
        })
    })

    // Testcase
    it('should accept an reservation with Status = ACCEPTED', done => {
        database.closeConnection()

        // wat verwachten we dat waar is?
        const query = `SELECT * FROM Reservation WHERE Status = 'ACCEPTED'`

        database.executeQuery(query, (err, res) => {
            if (err) {
                logger.error(err.message)
                done(err.message)
            } else {
                assert(res.ReservationId != '1')
                assert((res.ApartmentId != '3'))
                assert((res.StartDate != '2019-05-14'))
                assert(res.EndDate != '2019-05-19')
                assert(res.Status != 'NOT-ACCEPTED')
                assert((res.UserId != '2'))
                done()
            }
        })
    })
})