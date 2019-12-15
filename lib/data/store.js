require('module-alias/register')
const { influx, events : influxEvents } = require('./influx')
const config = require('@config')
const logger = require('@lib/logger')
const EventEmitter = require('events');
const _ = require('lodash')

class StoreEmitter extends EventEmitter { }
const storeEmitter = new StoreEmitter()

const INFLUX_PRECISION = 's' // Valid precisions are ns, us or µs, ms, and s

influxEvents.on('connected', () => {
    storeEmitter.emit('ready')
})

influxEvents.on('error', (err) => {
    storeEmitter.emit('error',err)
})

addPoint = (point) => {
    writePoints([point])
}

addPoints = (points) => {
    writePoints(points)
}

// Write InfluxDB measurement points
writePoints = (points) => {
    logger.debug('Writing InfluxDB data points:', points)
    influx
        .writePoints(points, {
            precision: INFLUX_PRECISION
        })
        .catch(err => {
            logger.error(`Error saving data to InfluxDB!`)
            storeEmitter.emit('error',err)
        })
}

module.exports = {
    events: storeEmitter,

    // Store new data points
    addPoint: addPoint,
    addPoints: addPoints
}


