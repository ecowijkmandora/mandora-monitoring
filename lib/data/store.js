require('module-alias/register')
const { influx, events: influxEvents } = require('./influx')
const { connection: mysql, events: mysqlEvents } = require('./mysql')
const config = require('@config')
const logger = require('@lib/logger')
const EventEmitter = require('events')
const _ = require('lodash')

class StoreEmitter extends EventEmitter {}
const storeEmitter = new StoreEmitter()

const INFLUX_PRECISION = 's' // Valid precisions are ns, us or µs, ms, and s

let influxConnected = false
let mysqlConnected = false

const storeReady = () => {
	return influxConnected && mysqlConnected
}

influxEvents.on('connected', () => {
	influxConnected = true
	if (storeReady()) storeEmitter.emit('ready')
})

influxEvents.on('error', err => {
	storeEmitter.emit('error', err)
})

mysqlEvents.on('connected', () => {
	mysqlConnected = true
	if (storeReady()) storeEmitter.emit('ready')
})

mysqlEvents.on('error', err => {
	storeEmitter.emit('error', err)
})

addPoint = point => {
	writePoints([point])
}

addPoints = points => {
	logger.debug('Writing InfluxDB data points:', points)
	influx
		.writePoints(points, {
			precision: INFLUX_PRECISION
		})
		.catch(err => {
			logger.error(`Error saving data to InfluxDB!`)
			storeEmitter.emit('error', err)
		})
}

module.exports = {
	events: storeEmitter,
	mysql: mysql,
	influx: influx,

	// Store new data points
	addPoint: addPoint,
	addPoints: addPoints
}
