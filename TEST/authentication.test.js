const chai = require('chai')
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken')

const server = require('../index')

chai.should()
chai.use(chaiHttp)

describe('Authentication API GET users', () => {
    it('should return all users from the database', done => {

        chai
            .request(server)
            .get('/api/users')
            .end( (err, res) => {
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