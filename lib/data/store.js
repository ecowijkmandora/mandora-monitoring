require('module-alias/register')
const influx = require('./influx')
const config = require('@config')
const logger = require('@lib/logger')
const EventEmitter = require('events');
const _ = require('lodash')

const INFLUX_PRECISION = 's' // Valid precisions are ns, us or µs, ms, and s

addIthoData = (origin,source,type,data) => {
    logger.debug('Adding new Itho data to store: ', data)

    const tags = {
        origin: origin,
        source: source,
        type: type,
    }

    const fields = {        
    }

    const point = {
        measurement: "itho",
        tags: tags,
        fields: fields,
        timestamp: data.datetime,
    }

    logger.debug('InfluxDB data point:',point)
    

}

// Add input data in InfluxDB and alert listeners
addData = (data) => {
    logger.debug('Adding new data to store: ', data)

    // Create timestamp
    const time = data.time || Date.now()
    // .. rest of fields

    // Create points for InfluxDB
    // const points = extractPointsFromMetrics(
    //     time
    //     // .. rest of fields
    // )
    
    logger.debug('Writing points to InfluxDB:', points)

    // Write to InfluxDB
    // writePoints(points)
}

// Extract InfluxDB measurement points from input metrics
extractPointsFromMetrics = (timestamp) => {

    let points = []

    _.forEach(metrics, (metric, index, arr) => {
        const point = {
            measurement: index,
            tags: tags,
            fields: metric,
            timestamp: timestamp,
        }
        points.push(point)
    })

    return points
}

// Write InfluxDB measurement points
writePoints = (points) => {
    influx.writePoints(points, {
        precision: INFLUX_PRECISION
    })
        .catch(error => {
            logger.error(`Error saving data to InfluxDB! ${err.stack}`)
        });
}

module.exports = {
    // Store new data 
    addData: addData,
    addIthoData: addIthoData
}


