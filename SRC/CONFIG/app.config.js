module.exports = {
    logger: require('tracer').colorConsole({
      format: [
        '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
        {
          error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})' // error format
        }
      ],
      dateformat: 'HH:MM:ss.L',
      preprocess: function(data) {
        data.title = data.title.toUpperCase()
      },
      level: process.env.LOG_LEVEL || 'trace'
    }),
  
    // databaseConfig: {
    //   user: process.env.DB_USERNAME || 'LucJoosten',
    //   password: process.env.DB_PASSWORD || 'Test1234',
    //   server: process.env.DB_HOSTNAME || 'localhost',
    //   database: process.env.DB_DATABASENAME || 'NodeMovieDB',
    //   port: 1433,
    //   driver: 'msnodesql',
    //   connectionTimeout: 1500,
    //   options: {
    //     // 'true' if you're on Windows Azure
    //     encrypt: false
    //   }
    // }
  }