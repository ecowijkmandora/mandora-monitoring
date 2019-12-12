require('module-alias/register')
const influx = require('./influx')
const config = require('@config')
const logger = require('@lib/logger')
const EventEmitter = require('events');
const _ = require('lodash')

const INFLUX_PRECISION = 's' // Valid precisions are ns, us or µs, ms, and s

addData = (timestamp, measurement, source, address, data) => {
    logger.debug('Adding new Itho data to store: ', data)

    const tags = {
        source: source,
        address: address
    }

    // Add fields from data
    const fields = data

    const point = {
        measurement: measurement,
        tags: tags,
        fields: fields,
        timestamp: timestamp,
    }

    writePoint(point)
}

// Write InfluxDB measurement point
writePoint = (point) => {
    writePoints([point])
}

// Write InfluxDB measurement points
writePoints = (points) => {
    logger.debug('Writing InfluxDB data points:', points)
    influx
        .writePoints(points, {
            precision: INFLUX_PRECISION
        })
        .catch(err => {
            logger.error(`Error saving data to InfluxDB! ${err.stack}`)
        })
}

module.exports = {
    // Store new data 
    addData: addData
}


