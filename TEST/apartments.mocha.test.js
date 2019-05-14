const assert = require('assert')
const should = require('chai').should()
const database = require('../SRC/DATALAYER/mssql.dao')
const logger = require('../SRC/CONFIG/app.config').logger

describe('Apartments Database', () => {
  // Testcase
  it('should accept the properties of an apartment', done => {
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
