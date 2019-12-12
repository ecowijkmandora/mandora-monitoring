require('module-alias/register')
const config = require('@config')
const Influx = require('influx');
const logger = require('@lib/logger')

const INFLUX_HOST = config.data.influx.host
const INFLUX_PORT = config.data.influx.port
const INFLUX_DB = config.data.influx.database
const INFLUX_RETENTION = config.data.influx.retention

const ITHO_CSV_MEASUREMENT_PREFIX = config.itho.csv.import.measurementPrefix
const ITHO_CSV_MEASUREMENT_ENERGY = ITHO_CSV_MEASUREMENT_PREFIX + config.itho.csv.import.energy.measurement
const ITHO_CSV_MEASUREMENT_TEMPERATURE = ITHO_CSV_MEASUREMENT_PREFIX + config.itho.csv.import.temperature.measurement

const INFLUX_TAGS = [
  'source', // CSV or API
  'address' // Identifier for the address
]

const INFLUX_SCHEMA = [
  {
    measurement: ITHO_CSV_MEASUREMENT_ENERGY,
    fields: {
      generated: Influx.FieldType.FLOAT,
      consumed: Influx.FieldType.FLOAT
    },
    tags: INFLUX_TAGS
  },
  {
    measurement: ITHO_CSV_MEASUREMENT_TEMPERATURE,
    fields: {
      outdoor: Influx.FieldType.FLOAT,
      indoor: Influx.FieldType.FLOAT,
      setpoint: Influx.FieldType.FLOAT
    },
    tags: INFLUX_TAGS
  }
]

// Create an instance of the InfluxDB object on database (INFLUX_DB)
const influx = new Influx.InfluxDB({
  host: INFLUX_HOST,
  database: INFLUX_DB,
  port: INFLUX_PORT,
  schema: INFLUX_SCHEMA
})

// Check the database (INFLUX_DB) and create if needed
influx.getDatabaseNames()
  .then(names => {
    if (!names.includes(INFLUX_DB)) {
      if (influx.createDatabase(INFLUX_DB)) {
        logger.info("Created new InfluxDB:",INFLUX_DB)
        // influx.createRetentionPolicy(INFLUX_RETENTION, {
        //   duration: INFLUX_RETENTION,
        //   replication: 1,
        //   isDefault: true
        // })
      }
    }
  })
  .catch(err => {
    logger.error(`Error creating Influx database!`);
    process.exit(1);
  })
  .finally(() => {
    logger.info("Initialized InfluxDB")
  })

// Export the InfluxDB object
module.exports = influx