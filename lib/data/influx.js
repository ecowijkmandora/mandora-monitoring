require('module-alias/register')
const config = require('@config')
const Influx = require('influx')
const logger = require('@lib/logger')
const EventEmitter = require('events')

class InfluxEmitter extends EventEmitter {}
const influxEmitter = new InfluxEmitter()

const INFLUX_HOST = config.data.influx.host
const INFLUX_PORT = config.data.influx.port
const INFLUX_DB = config.data.influx.database
const INFLUX_USERNAME = config.data.influx.username
const INFLUX_PASSWORD = config.data.influx.password
const INFLUX_RETENTION = config.data.influx.retention

const ITHO_CSV_MEASUREMENT_PREFIX = config.itho.csv.import.measurementPrefix
const ITHO_CSV_MEASUREMENT_ENERGY =
	ITHO_CSV_MEASUREMENT_PREFIX +
	config.itho.csv.import.energy_installation.measurement
const ITHO_CSV_MEASUREMENT_TEMPERATURE_ENV =
	ITHO_CSV_MEASUREMENT_PREFIX +
	config.itho.csv.import.temperature_env.measurement
const ITHO_CSV_MEASUREMENT_TEMPERATURE_BOILER =
	ITHO_CSV_MEASUREMENT_PREFIX +
	config.itho.csv.import.temperature_boiler.measurement

const INFLUX_TAGS = [
	'source', // CSV or API
	'location', // Identifier for the address (UUID)
	'units' // Units of the measurement (kWh, C, etc)
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
		measurement: ITHO_CSV_MEASUREMENT_TEMPERATURE_ENV,
		fields: {
			outdoor: Influx.FieldType.FLOAT,
			indoor: Influx.FieldType.FLOAT,
			setting: Influx.FieldType.FLOAT
		},
		tags: INFLUX_TAGS
	},
	{
		measurement: ITHO_CSV_MEASUREMENT_TEMPERATURE_BOILER,
		fields: {
			low: Influx.FieldType.FLOAT,
			high: Influx.FieldType.FLOAT
		},
		tags: INFLUX_TAGS
	}
]

// Create an instance of the InfluxDB object on database (INFLUX_DB)
const influx = new Influx.InfluxDB({
	host: INFLUX_HOST,
	database: INFLUX_DB,
	username: INFLUX_USERNAME,
	password: INFLUX_PASSWORD,
	port: INFLUX_PORT,
	schema: INFLUX_SCHEMA
})

// Check the database (INFLUX_DB) and create if needed
influx
	.getDatabaseNames()
	.then(names => {
		if (!names.includes(INFLUX_DB)) {
			if (influx.createDatabase(INFLUX_DB)) {
				logger.info('Created new InfluxDB:', INFLUX_DB)
				// influx.createRetentionPolicy(INFLUX_RETENTION, {
				//   duration: INFLUX_RETENTION,
				//   replication: 1,
				//   isDefault: true
				// })
			}
		}
	})
	.catch(err => {
		logger.error(`Error creating Influx database!`, err)
		influxEmitter.emit('error', err)
	})
	.finally(() => {
		logger.info('Initialized InfluxDB')
		influxEmitter.emit('connected')
	})

// Export the InfluxDB object
module.exports = {
	influx: influx,
	events: influxEmitter
}
