module.exports = {
  logger: require('tracer').colorConsole({
    format: [
      '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
      {
        error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})' // error format
      }
    ],
    dateformat: 'HH:MM:ss.L',
    preprocess: function (data) {
      data.title = data.title.toUpperCase()
    },
    level: process.env.LOG_LEVEL || 'trace'
  }),

  databaseConfig: {
    user: process.env.DB_USERNAME || 'progr4',
    password: process.env.DB_PASSWORD || 'password123',
    server: process.env.DB_HOSTNAME || 'aei-sql.avans.nl',
    database: process.env.DB_DATABASENAME || 'Prog4-Eindopdracht1',
    port: 1443,
    driver: 'msnodesql',
    connectionTimeout: 1500,
    options: {
      // 'true' if you're on Windows Azure
      encrypt: false
    }
  },

  secretKey: process.env.SECRET_KEY || 'secret'
}

