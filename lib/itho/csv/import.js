require('module-alias/register')
const config = require('@config')
const fs = require('fs')
const parse = require('csv-parse')
const _ = require('lodash')
const moment = require('moment');
const { store } = require('@lib/data')
const logger = require('@lib/logger')

const ITHO_CSV_MEASUREMENT_PREFIX = config.itho.csv.import.measurementPrefix
const ITHO_CSV_DELIMITER = config.itho.csv.import.delimiter

importCsvEnergyInstallation = (location, filename, parser) => {
    logger.info(`Starting CSV import (importCsvEnergyInstallation) for location ${location}`)

    const ITHO_CSV_MEASUREMENT_ENERGY_INSTALLATION_NAME = ITHO_CSV_MEASUREMENT_PREFIX + config.itho.csv.import.energy_installation.measurement
    const ITHO_CSV_MEASUREMENT_ENERGY_INSTALLATION_FIELDS = config.itho.csv.import.energy_installation.fields
    const ITHO_CSV_MEASUREMENT_ENERGY_INSTALLATION_UNITS = config.itho.csv.import.energy_installation.units
    const ITHO_CSV_IMPORT_SOURCE = config.itho.csv.import.source

    const csvEnergyInstallationParser = parse({
        delimiter: ITHO_CSV_DELIMITER,
        from_line: 2
    })

    let points = []    

    csvEnergyInstallationParser.on('readable', () => {
        let record
        while (record = csvEnergyInstallationParser.read()) {
            logger.debug('* Record:', record)

            let timestamp = Date.now()            
            let tags = {
                source : ITHO_CSV_IMPORT_SOURCE,                
                units : ITHO_CSV_MEASUREMENT_ENERGY_INSTALLATION_UNITS,
                location : location
            }
            
            // Collect field data from record
            let fields = {}
            _.forEach(ITHO_CSV_MEASUREMENT_ENERGY_INSTALLATION_FIELDS, (field, idx, arr) => {
                let value = record[idx]
                logger.debug(`* Field value (${idx}) ${field}:`, value)

                switch (field) {
                    case 'timestamp':                        
                        timestamp = moment(value, 'M/D/YYYY, h:mm:ss a').toDate() // "7/30/2019, 2:00:00 AM"
                        break
                    case 'generated':
                    case 'consumed':
                        value = parseFloat(value.split(",").join(""))
                        fields[field] = value
                        break
                    default:
                        break
                }
            })

            points.push({
                timestamp : timestamp,
                measurement : ITHO_CSV_MEASUREMENT_ENERGY_INSTALLATION_NAME,
                tags : tags,
                fields : fields
            })
        }
    })

    csvEnergyInstallationParser.on('error', (err) => {
        logger.error(`Error occured while running CSV importy (importCsvEnergyInstallation) for location ${location}`, err.message)
    })

    csvEnergyInstallationParser.on('end', () => {
        logger.info(`Finished CSV import (importCsvEnergyInstallation) for location ${location}`)
        store.addPoints(points)
    })

    fs.createReadStream(filename).pipe(csvEnergyInstallationParser)
}

importCsvTemperatureEnv = (location, filename, parser) => {
    logger.info(`Starting CSV import (importCsvTemperatureEnv) for location ${location}`)

    const ITHO_CSV_MEASUREMENT_TEMPERATURE_ENV_NAME = ITHO_CSV_MEASUREMENT_PREFIX + config.itho.csv.import.temperature_env.measurement
    const ITHO_CSV_MEASUREMENT_TEMPERATURE_ENV_FIELDS = config.itho.csv.import.temperature_env.fields
    const ITHO_CSV_MEASUREMENT_TEMPERATURE_ENV_UNITS = config.itho.csv.import.temperature_env.units
    const ITHO_CSV_IMPORT_SOURCE = config.itho.csv.import.source

    const csvTemperatureEnvParser = parse({
        delimiter: ITHO_CSV_DELIMITER,
        from_line: 2
    })

    let points = []

    csvTemperatureEnvParser.on('readable', () => {
        let record
        while (record = csvTemperatureEnvParser.read()) {
            logger.debug('* Record:', record)

            let timestamp = Date.now()

            let tags = {
                source : ITHO_CSV_IMPORT_SOURCE,                
                units : ITHO_CSV_MEASUREMENT_TEMPERATURE_ENV_UNITS,
                location : location
            }

            // Collect field data from record
            let fields = {}
            _.forEach(ITHO_CSV_MEASUREMENT_TEMPERATURE_ENV_FIELDS, (field, idx, arr) => {
                let value = record[idx]
                logger.debug(`* Field value (${idx}) ${field}:`, value)

                switch (field) {
                    case 'timestamp':                        
                        timestamp = moment(value, 'M/D/YYYY, h:mm:ss a').toDate() // "7/30/2019, 2:00:00 AM"
                        break
                    case 'outdoor':
                    case 'indoor':
                    case 'setting':
                        value = parseFloat(value.split(",").join(""))
                        fields[field] = value
                        break
                    default:
                        break
                }
            })

            points.push({
                timestamp : timestamp,
                measurement : ITHO_CSV_MEASUREMENT_TEMPERATURE_ENV_NAME,
                tags : tags,
                fields : fields
            })
        }        
    })

    csvTemperatureEnvParser.on('error', (err) => {
        logger.error(`Error occured while running CSV importy (importCsvTemperatureEnv) for location ${location}`, err.message)
    })

    csvTemperatureEnvParser.on('end', () => {
        logger.info(`Finished CSV import (importCsvTemperatureEnv) for location ${location}`)
        store.addPoints(points)
    })

    fs.createReadStream(filename).pipe(csvTemperatureEnvParser)
}

importCsvTemperatureBoiler = (location, filename, parser) => {
    logger.info(`Starting CSV import (importCsvTemperatureBoiler) for location ${location}`)

    const ITHO_CSV_MEASUREMENT_TEMPERATURE_BOILER_NAME = ITHO_CSV_MEASUREMENT_PREFIX + config.itho.csv.import.temperature_boiler.measurement
    const ITHO_CSV_MEASUREMENT_TEMPERATURE_BOILER_FIELDS = config.itho.csv.import.temperature_boiler.fields
    const ITHO_CSV_MEASUREMENT_TEMPERATURE_BOILER_UNITS = config.itho.csv.import.temperature_boiler.units
    const ITHO_CSV_IMPORT_SOURCE = config.itho.csv.import.source

    const csvTemperatureBoilerParser = parse({
        delimiter: ITHO_CSV_DELIMITER,
        from_line: 2
    })

    let points = []

    csvTemperatureBoilerParser.on('readable', () => {
        let record
        while (record = csvTemperatureBoilerParser.read()) {
            logger.debug('* Record:', record)

            let timestamp = Date.now()
            let tags = {
                source : ITHO_CSV_IMPORT_SOURCE,                
                units : ITHO_CSV_MEASUREMENT_TEMPERATURE_BOILER_UNITS,
                location : location
            }

            // Collect field data from record
            let fields = {}
            _.forEach(ITHO_CSV_MEASUREMENT_TEMPERATURE_BOILER_FIELDS, (field, idx, arr) => {
                let value = record[idx]
                logger.debug(`* Field value (${idx}) ${field}:`, value)

                switch (field) {
                    case 'timestamp':                        
                        timestamp = moment(value, 'M/D/YYYY, h:mm:ss a').toDate() // "7/30/2019, 2:00:00 AM"
                        break
                    case 'high':
                    case 'low':
                        value = parseFloat(value.split(",").join(""))
                        fields[field] = value
                        break
                    default:
                        break
                }
            })

            points.push({
                timestamp : timestamp,
                measurement : ITHO_CSV_MEASUREMENT_TEMPERATURE_BOILER_NAME,
                tags : tags,
                fields : fields
            })
        }        
    })

    csvTemperatureBoilerParser.on('error', (err) => {
        logger.error(`Error occured while running CSV importy (importCsvTemperatureBoiler) for location ${location}`, err.message)
    })

    csvTemperatureBoilerParser.on('end', () => {
        logger.info(`Finished CSV import (importCsvTemperatureBoiler) for location ${location}`)
        store.addPoints(points)
    })

    fs.createReadStream(filename).pipe(csvTemperatureBoilerParser)
}

module.exports = {
    importCsvEnergyInstallation: importCsvEnergyInstallation,
    importCsvTemperatureEnv: importCsvTemperatureEnv,
    importCsvTemperatureBoiler: importCsvTemperatureBoiler
}