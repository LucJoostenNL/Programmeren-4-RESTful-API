// const chai = require('chai')
// const chaiHttp = require('chai-http')
// const jwt = require('jsonwebtoken')
// const logger = require('../SRC/CONFIG/app.config').logger


// // LET OP: voeg onder aan app.js toe: module.exports = app
// const server = require('../index')

// chai.should()
// chai.use(chaiHttp)

// const endpointToTest = '/api/register'
// const authorizationHeader = 'Authorization'
// let token

// //
// // Deze functie wordt voorafgaand aan alle tests 1 x uitgevoerd.
// //
// before(() => {
//     console.log('- before')
//     // We hebben een token nodig om een ingelogde gebruiker te simuleren.
//     // Hier kiezen we ervoor om een token voor UserId 1 te gebruiken.
//     const payload = {
//       UserId: 1
//     }
//     jwt.sign({ data: payload }, 'secretkey', { expiresIn: 2 * 60 }, (err, result) => {
//       if (result) {
//         token = result
//       }
//     })
//   })
  
//   beforeEach(() => {
//     console.log('- beforeEach')
//   })

//   describe('User API POST to register a new user', () => {
//     it('should return response status 200', done => {
//       chai
//         .request(server)
//         .post(endpointToTest)
//         .set('Content-Type', 'application/json')
//         .send({
//           firstName: 'Maria',
//           lastName: 'Van Akker',
//           streetAddress: 'Europalaan 12a',
//           postalCode: '3829BR',
//           city: 'Rotterdam',
//           dateOfBirth: '1994-09-17',
//           phoneNumber: '0697514820',
//           emailAddress: 'aasd24354sdfdghf6sdf5af34rf12343m1112@gmail.com',
//           password: 'rotterdam'
//         })
//         .end((err, res, body) => {
//           res.should.have.status(200)
//         //   res.body.should.be.a('object')
  
//         //   const result = res.body.result
//         //   result.should.be.an('array')

//         const result = res.body.result
//         const apartment = result

//           //logger.warn(res)
//           apartment.should.have.property('firstName')
//           apartment.should.have.property('lastName').that.is.a('string')
//           apartment.should.have.property('postalCode').equals('3829BR')
//           apartment.should.have.property('city').equals('Rotterdam')
//           apartment.should.have.property('password').equals('rotterdam')
//           done()
//         })
//     })
  
//     it('should throw an error when the database is full', done => {
//       done()
//     })
//   })