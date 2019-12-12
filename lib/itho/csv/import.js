require('module-alias/register')
const config = require('@config')
const fs = require('fs')
const parse = require('csv-parse')
const _ = require('lodash')
const moment = require('moment');
const { store } = require('@lib/data')
const logger = require('@lib/logger')

const ITHO_CSV_MEASUREMENT_PREFIX = config.itho.csv.import.measurementPrefix
const ITHO_CSV_MEASUREMENT_ENERGY = ITHO_CSV_MEASUREMENT_PREFIX + config.itho.csv.import.energy.measurement
const ITHO_CSV_MEASUREMENT_TEMPERATURE = ITHO_CSV_MEASUREMENT_PREFIX + config.itho.csv.import.temperature.measurement
const ITHO_CSV_SOURCE_TAG = config.itho.csv.import.sourceTag

const CSV_DELIMITER = config.itho.csv.import.delimiter
const ITHO_CSV_ENERGY_COLUMNS = config.itho.csv.import.energy.data_columns
const ITHO_CSV_TEMPERATURE_COLUMNS = config.itho.csv.import.temperature.data_columns

const address = "3991MA2"

// Date Time;Total generated energy by the installation after completion;Date Time;Total consumed energy by the installation after completion
const energyParser = parse({
    delimiter: CSV_DELIMITER,
    from_line: 2
})

// Date Time;T outdoor;Date Time;T indoor;Date Time;T set
const temperatureParser = parse({
    delimiter: CSV_DELIMITER,
    from_line: 2
})

let errors = []
let processed = []

energy = (filename) => { 
    importCsv(filename,energyParser)
}

temperature = (filename) => { 
    importCsv(filename,temperatureParser)
}

importCsv = (filename,parser) => {
    fs.createReadStream(filename).pipe(parser)
}

module.exports = {
    energy: energy,
    temperature: temperature
}

// Use the readable stream api
energyParser.on('readable', () => {
    let record
    while (record = energyParser.read()) {
        logger.info('energyParser record:', record)

        let data = {}
        let timestamp = Date.now()

        // Collect data from record
        _.forEach(ITHO_CSV_ENERGY_COLUMNS, (column, idx, arr) => {
            let value = record[idx]
            logger.debug(`Column ${idx} (${column}):`, value)

            switch (column) {
                case 'datetime':
                    // "7/30/2019, 2:00:00 AM"
                    timestamp = moment(value, 'M/D/YYYY, h:mm:ss a').toDate()
                    logger.debug("Timestamp:", timestamp)
                    break
                case 'generated':
                case 'consumed':
                    value = parseFloat(value.split(",").join(""))
                    logger.debug("Float:", value)
                    data[column] = value
                    break
                default:
                    break
            }            
        })

        // Store data in data store
        store.addData(timestamp, ITHO_CSV_MEASUREMENT_ENERGY, ITHO_CSV_SOURCE_TAG, address, data)

        logger.debug("energyParser data:", data)

        // Push record to array of processed lines
        processed.push(record)
    }
})

// Catch any error
energyParser.on('error', (err) => {
    logger.error('energyParser error:', err.message)
})

// When we are done, test that the parsed output matched what expected
energyParser.on('end', () => {
    logger.debug("energyParser end")
})

// Use the readable stream api
temperatureParser.on('readable', () => {
    let record
    while (record = temperatureParser.read()) {
        logger.info('temperatureParser record', record)

        let data = {}
        let timestamp = Date.now()

        // Collect data from record
        _.forEach(ITHO_CSV_TEMPERATURE_COLUMNS, (column, idx, arr) => {
            let value = record[idx]
            logger.debug(`Column ${idx} (${column}):`, value)

            switch (column) {
                case 'datetime':
                    // "7/30/2019, 2:00:00 AM"
                    timestamp = moment(value, 'M/D/YYYY, h:mm:ss a').toDate()
                    logger.debug("Timestamp:", timestamp)
                    break
                case 'outdoor':
                case 'indoor':
                case 'setpoint':
                    value = parseFloat(value.split(",").join(""))
                    logger.debug("Float:", value)
                    data[column] = value
                    break
                default:
                    break
            }            
        })

        // Store data in data store
        store.addData(timestamp, ITHO_CSV_MEASUREMENT_TEMPERATURE, ITHO_CSV_SOURCE_TAG, address, data)

        logger.debug("temperatureParser data:", data)

        // Push record to array of processed lines
        processed.push(record)
    }
})

// Catch any error
temperatureParser.on('error', (err) => {
    logger.error('temperatureParser error:', err.message)
})

// When we are done, test that the parsed output matched what expected
temperatureParser.on('end', () => {
    logger.debug("temperatureParser end")
})