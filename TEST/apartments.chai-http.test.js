const chai = require('chai')
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken')
const logger = require('../SRC/CONFIG/app.config').logger


// LET OP: voeg onder aan app.js toe: module.exports = app
const server = require('../index')

chai.should()
chai.use(chaiHttp)

const endpointToTest = '/api/register'
const endPointWithID_1 = 'api/apartments/1'
const authorizationHeader = 'Authorization'
let token

//
// Deze functie wordt voorafgaand aan alle tests 1 x uitgevoerd.
//
before(() => {
    console.log('- before')
    // We hebben een token nodig om een ingelogde gebruiker te simuleren.
    // Hier kiezen we ervoor om een token voor UserId 1 te gebruiken.
    const payload = {
      UserId: 1
    }
    jwt.sign({ data: payload }, 'secretkey', { expiresIn: 2 * 60 }, (err, result) => {
      if (result) {
        token = result
      }
    })
  })
  
  beforeEach(() => {
    console.log('- beforeEach')
  })


/*  ==========================       
    =    POST METHOD TEST    =
    ==========================
*/

  describe('User API POST to register a new user', () => {
    it('should return response status 200', done => {
      chai
        .request(server)
        .post(endpointToTest)
        .set('Content-Type', 'application/json')
        .send({
          firstName: 'Maria',
          lastName: 'Van Akker',
          streetAddress: 'Europalaan 12a',
          postalCode: '3829BR',
          city: 'Rotterdam',
          dateOfBirth: '1994-09-17',
          phoneNumber: '0697514820',
          emailAddress: 'maria1289sdf63@gmail.com',
          password: 'rotterdam'
        })
        .end((err, res, body) => {
        
            if(res) {
                res.should.have.status(200)
               
                res.body.should.be.an('object')
                res.body.should.have.property('firstName').that.is.a('string')
                res.body.should.have.property('lastName').that.is.a('string')
                res.body.should.have.property('streetAddress').that.is.a('string')
                res.body.should.have.property('postalCode').that.is.a('string')
                res.body.should.have.property('city').that.is.a('string')
                res.body.should.have.property('dateOfBirth').that.is.a('string')
                res.body.should.have.property('phoneNumber').that.is.a('string').equals('0697514820')
                res.body.should.have.property('emailAddress').that.is.a('string')
                res.body.should.have.property('password').that.is.a('string')
                res.body.should.not.have.property('education')

                done();
            }   
        })
    })
  
        it("should return an error with code: 404", done => {
        chai
            .request(server)
            .post("/random")
            .set('Content-Type', 'application/json')
            .end((err, res) => {

                // Because the path is not right, the status should
                // return an error with status code 404
                res.status.should.equal(404);
                done();
            });
    });

  })


/*  ==========================       
    =    GET METHOD TEST     =
    ==========================
*/

describe('Gets an apartment from the server by ID', () => {

    it('Returns an apartment by ID (GET - method)', done => {
        chai
            .request(server)
            .get(endPointWithID_1)
            .end((err, res) => {
                // The response status should be equal to 200
                res.status.should.equal(200);

                const description = 'Woon huis Student';
                
                // the body should be equal to the posted object on place [1]
                res.body.description.should.equal(description);
                done();
            });
    });

    it("should return an error with code: 404", done => {
        chai
            .request(server)
            .get("/random")
            .end((err, res) => {

                // Because the path is not right, the status should
                // return an error with status code 404
                res.status.should.equal(404);
                done();
            });
    });
});
