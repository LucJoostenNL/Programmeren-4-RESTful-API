module.exports = {
  // aparte configuratie voor Logger zodat dit maar 1 keer geïnitialiseert hoeft te worden
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

  // database configuratie om met de juiste gegevens verbinding te maken met de externe database
  // process.env zijn de ENvironment Variables oftewel; de omgevings variabelen die op je apparaat zijn ingesteld
  databaseConfig: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOSTNAME,
    database: process.env.DB_DATABASENAME,
    // poort nummer
    port: 1443,
    // driver voor het creeeren van de verbinding
    driver: 'msnodesql',
    connectionTimeout: 1500,
    options: {
      // 'true' if you're on Windows Azure
      encrypt: false
    }
  },

  // secretkey voor JWT authenticatie
  secretKey: process.env.SECRET_KEY || 'secret'
}
