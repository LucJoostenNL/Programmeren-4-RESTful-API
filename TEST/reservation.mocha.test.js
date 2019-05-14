const assert = require('assert')
const should = require('chai').should()
const database = require('../SRC/DATALAYER/mssql.dao')
const logger = require('../SRC/CONFIG/app.config').logger

describe('Reservation Database', () => {
  // Testcase
  it('should accept the properties of an reservation', done => {
    
    // wat verwachten we dat waar is?
    const reservation = {
      id        : '5',
      startDate : '2019-05-14',
      endDate   : '2019-05-19',
      status    : 'INITIAL'
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
})