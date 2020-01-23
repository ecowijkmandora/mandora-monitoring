require('module-alias/register')
const config = require('@config')
const parse = require('csv-parse')
const _ = require('lodash')
const moment = require('moment')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const streamifier = require('streamifier')

const ITHO_CSV_MEASUREMENT_PREFIX = config.itho.csv.import.measurementPrefix
const ITHO_CSV_DELIMITER = config.itho.csv.import.delimiter

importCsvEnergy = (location, buffer) => {
	logger.info(
		`Starting CSV import (importCsvEnergy) for location ${location}`
	)

	const ITHO_CSV_MEASUREMENT_ENERGY_NAME =
		ITHO_CSV_MEASUREMENT_PREFIX + config.itho.csv.import.energy.measurement
	const ITHO_CSV_MEASUREMENT_ENERGY_UNITS =
		config.itho.csv.import.energy.units
	const ITHO_CSV_MEASUREMENT_ENERGY_COLUMNS =
		config.itho.csv.import.energy.columns
	const ITHO_CSV_MEASUREMENT_ENERGY_DATASETS =
		config.itho.csv.import.energy.datasets

	const ITHO_CSV_IMPORT_SOURCE = config.itho.csv.import.source

	const csvEnergyParser = parse({
		delimiter: ITHO_CSV_DELIMITER,
		from_line: 2,
		relax_column_count: true,
		columns: ITHO_CSV_MEASUREMENT_ENERGY_COLUMNS
	})

	let points = []

	csvEnergyParser.on('readable', () => {
		let record
		while ((record = csvEnergyParser.read())) {
			logger.debug('* Record:', record)

			// if (record.length != ITHO_CSV_MEASUREMENT_ENERGY_COLUMNS.length) {
			// 	logger.warn(
			// 		`! importCsvEnergy for location ${location}: Ignoring CSV line because of incorrect number of columns in CSV file`,
			// 		record
			// 	)
			// 	break
			// }

			let timestamp = Date.now()
			let tags = {
				source: ITHO_CSV_IMPORT_SOURCE,
				units: ITHO_CSV_MEASUREMENT_ENERGY_UNITS,
				location: location
			}

			_.forEach(ITHO_CSV_MEASUREMENT_ENERGY_DATASETS, dataset => {
				let fields = {}
				let isValid = false

				_.forEach(dataset, (field, idx, arr) => {
					let value = record[field]
					logger.debug(
						`* importCsvEnergy for location ${location}: Field value (${field}):`,
						value
					)

					switch (field) {
						case 'generated_timestamp':
						case 'consumed_timestamp':
							timestamp = moment(
								value,
								'M/D/YYYY, h:mm:ss a'
							).toDate() // "7/30/2019, 2:00:00 AM"
							isValid = timestamp != ''
							break
						case 'generated':
						case 'consumed':
							value = parseFloat(value.split(',').join(''))
							isValid = !isNaN(value)
							fields[field] = value
							break
						default:
							isValid = false
							break
					}
				})

				if (isValid) {
					logger.debug('* Fields to store:', fields)
					points.push({
						timestamp: timestamp,
						measurement: ITHO_CSV_MEASUREMENT_ENERGY_NAME,
						tags: tags,
						fields: fields
					})
				} else {
					console.warn(
						`! importCsvEnergy for location ${location}: Ignoring dataset ${dataset} because of empty value`,
						record
					)
				}
			})
		}
	})

	csvEnergyParser.on('error', err => {
		logger.error(
			`Error occured while running CSV import (importCsvEnergy) for location ${location}`,
			err.message
		)
	})

	csvEnergyParser.on('end', () => {
		logger.info(
			`Finished CSV import (importCsvEnergy) for location ${location}`
		)
		store.addPoints(points)
	})

	streamifier.createReadStream(buffer).pipe(csvEnergyParser)
}

importCsvTemperature = (location, buffer) => {
	logger.info(
		`Starting CSV import (importCsvTemperature) for location ${location}`
	)

	const ITHO_CSV_MEASUREMENT_TEMPERATURE_NAME =
		ITHO_CSV_MEASUREMENT_PREFIX +
		config.itho.csv.import.temperature.measurement
	const ITHO_CSV_MEASUREMENT_TEMPERATURE_UNITS =
		config.itho.csv.import.temperature.units
	const ITHO_CSV_MEASUREMENT_TEMPERATURE_COLUMNS =
		config.itho.csv.import.temperature.columns
	const ITHO_CSV_MEASUREMENT_TEMPERATURE_DATASETS =
		config.itho.csv.import.temperature.datasets

	const ITHO_CSV_IMPORT_SOURCE = config.itho.csv.import.source

	const csvTemperatureParser = parse({
		delimiter: ITHO_CSV_DELIMITER,
		from_line: 2,
		relax_column_count: true,
		columns: ITHO_CSV_MEASUREMENT_TEMPERATURE_COLUMNS
	})

	let points = []

	csvTemperatureParser.on('readable', () => {
		let record
		while ((record = csvTemperatureParser.read())) {
			logger.debug('* Record:', record)
			// if (record.length != ITHO_CSV_MEASUREMENT_TEMPERATURE_COLUMNS) {
			// 	logger.warn(
			// 		`! importCsvTemperature for location ${location}: Ignoring CSV line because of incorrect number of columns in CSV file`,
			// 		record
			// 	)
			// 	break
			// }

			let timestamp = Date.now()
			let tags = {
				source: ITHO_CSV_IMPORT_SOURCE,
				units: ITHO_CSV_MEASUREMENT_TEMPERATURE_UNITS,
				location: location
			}

			_.forEach(ITHO_CSV_MEASUREMENT_TEMPERATURE_DATASETS, dataset => {
				let fields = {}
				let isValid = false

				_.forEach(dataset, (field, idx, arr) => {
					let value = record[field]
					logger.debug(
						`* importCsvTemperature for location ${location}: Field value (${field}):`,
						value
					)

					switch (field) {
						case 'boiler_high_timestamp':
						case 'boiler_low_timestamp':
						case 'outdoor_timestamp':
						case 'indoor_timestamp':
						case 'setting_timestamp':
							timestamp = moment(
								value,
								'M/D/YYYY, h:mm:ss a'
							).toDate() // "7/30/2019, 2:00:00 AM"
							//isValid = timestamp != ''
							break
						case 'boiler_high':
						case 'boiler_low':
						case 'outdoor':
						case 'indoor':
						case 'setting':
							value = parseFloat(value)
							isValid = !isNaN(value)
							fields[field] = value
							break
						default:
							isValid = false
							break
					}
				})

				if (isValid) {
					logger.debug('* Fields to store:', fields)
					points.push({
						timestamp: timestamp,
						measurement: ITHO_CSV_MEASUREMENT_TEMPERATURE_NAME,
						tags: tags,
						fields: fields
					})
				} else {
					console.warn(
						`! importCsvTemperature for location ${location}: Ignoring dataset ${dataset} because of empty value`,
						record
					)
				}
			})
		}
	})

	csvTemperatureParser.on('error', err => {
		logger.error(
			`Error occured while running CSV importy (importCsvTemperature) for location ${location}`,
			err.message
		)
	})

	csvTemperatureParser.on('end', () => {
		logger.info(
			`Finished CSV import (importCsvTemperature) for location ${location}`
		)
		store.addPoints(points)
	})

	streamifier.createReadStream(buffer).pipe(csvTemperatureParser)
}

module.exports = {
	importCsvEnergy: importCsvEnergy,
	importCsvTemperature: importCsvTemperature
}
