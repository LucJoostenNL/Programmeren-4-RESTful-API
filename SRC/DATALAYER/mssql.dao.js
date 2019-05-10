const sql = require('mssql')
const config = require('../CONFIG/app.config')

const logger = config.logger
const databaseConfig = config.databaseConfig

module.exports = {
  executeQuery: (query, callback) => {
    sql.connect(databaseConfig, err => {
      // ... error checks
      if (err) {
        logger.error('Error connecting: ', err.toString())
        callback(err, null)
        sql.close()
      }
      if (!err) {
        // Query
        new sql.Request().query(query, (err, result) => {
          // ... error checks
          if (err) {
            logger.error('error', err.toString())
            callback(err, null)
            sql.close()
          }
          if (result) {
            logger.info(result)
            // result.recordset.forEach(item => console.log(item.number))
            callback(null, result)
            sql.close()
          }
        })
      }
    })
  }
}
