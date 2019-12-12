require('module-alias/register')
const config = require('@config')
const Influx = require('influx');

const INFLUX_HOST = config.data.influx.host
const INFLUX_PORT = config.data.influx.port
const INFLUX_DB = config.data.influx.database 
const INFLUX_RETENTION = config.data.influx.retention

const INFLUX_TAGS = [
  'origin', // Identifier of the house where the measurement originates from
  'source', // Identifier of the source of the measurement
]

const INFLUX_SCHEMA = [
  {
    measurement: 'linearaccel',
    fields: {
      x: Influx.FieldType.FLOAT,
      y: Influx.FieldType.FLOAT,
      z: Influx.FieldType.FLOAT
    },
    tags: INFLUX_TAGS
  },
  {
    measurement: 'accel',
    fields: {
      x: Influx.FieldType.FLOAT,
      y: Influx.FieldType.FLOAT,
      z: Influx.FieldType.FLOAT
    },
    tags: INFLUX_TAGS
  },
  {
    measurement: 'gyroscope',
    fields: {
      x: Influx.FieldType.FLOAT,
      y: Influx.FieldType.FLOAT,
      z: Influx.FieldType.FLOAT
    },
    tags: INFLUX_TAGS
  },
  {
    measurement: 'magnetometer',
    fields: {
      x: Influx.FieldType.FLOAT,
      y: Influx.FieldType.FLOAT,
      z: Influx.FieldType.FLOAT
    },
    tags: INFLUX_TAGS
  },
  {
    measurement: 'euler',
    fields: {
      x: Influx.FieldType.FLOAT,
      y: Influx.FieldType.FLOAT,
      z: Influx.FieldType.FLOAT
    },
    tags: INFLUX_TAGS
  },
  {
    measurement: 'quaternion',
    fields: {
      w: Influx.FieldType.FLOAT,
      x: Influx.FieldType.FLOAT,
      y: Influx.FieldType.FLOAT,
      z: Influx.FieldType.FLOAT
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
        influx.createRetentionPolicy(INFLUX_RETENTION, {
          duration: INFLUX_RETENTION,
          replication: 1,
          isDefault: true
        })
      }
    }
  })
  .catch(err => {
    console.error(`Error creating Influx database!`);
    process.exit(1);
  })
  .finally(() => {
    console.log("Initialized InfluxDB")
  })

// Export the InfluxDB object
module.exports = influx