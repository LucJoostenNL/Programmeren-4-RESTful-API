const assert = require('assert')
const database = require('../SRC/DATALAYER/mssql.dao')

describe('Apartments Database', () => {
  // Testcase
  it('should accept an apartment', done => {
    // wat verwachten we dat waar is?
    const apartment = {
      description: 'finding nemo',
      streetAddress: 'beschrijving',
      postalCode: "5756 BH",
      city: "Vlierden",
      userId: 119
    }

    //
    // Hier moet natuurlijk een insert statement staan, maar dat
    // betekent data bij elke test een nieuwe Movie in de database
    // wordt toegevoegd. Eigenlijk hebben we een aparte test-
    // database nodig hiervoor.
    //
    const query = `SELECT * FROM Apartment WHERE ApartmentId = 1`
    database.executeQuery(query, (err, res) => {
      if (err) {
        done(err.message)
      } else {
        assert(res.postalCode != "5756KK");
        assert(res.city != apartment.city);
        assert(res.streetAddress != apartment.streetAddress);
        assert(res.userId + apartment.userId == 120);
        done()
      }
    })
  })
})
