require('module-alias/register')
const config = require('@config')
const parse = require('csv-parse')
const _ = require('lodash')
const moment = require('moment')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const streamifier = require('streamifier')

const ITHO_MEASUREMENTS_PREFIX = config.itho.measurements.measurementPrefix

importCsvReadings = (location, buffer) => {
	logger.info(
		`Starting CSV import (importCsvReadings) for location ${location}`
	)

	const ITHO_MEASUREMENTS_READINGS_NAME =
		ITHO_MEASUREMENTS_PREFIX + config.itho.measurements.readings.measurement
	const ITHO_MEASUREMENTS_READINGS_UNITS =
		config.itho.measurements.readings.units
	const ITHO_MEASUREMENTS_READINGS_DELIMITER =
		config.itho.measurements.readings.delimiter
	const ITHO_MEASUREMENTS_READINGS_COLUMNS =
		config.itho.measurements.readings.columns
	const ITHO_MEASUREMENTS_READINGS_DATASETS =
		config.itho.measurements.readings.datasets
	const ITHO_MEASUREMENTS_READINGS_SOURCE =
		config.itho.measurements.readings.source

	const csvReadingsParser = parse({
		delimiter: ITHO_MEASUREMENTS_READINGS_DELIMITER,
		from_line: 2,
		relax_column_count: true,
		columns: ITHO_MEASUREMENTS_READINGS_COLUMNS
	})

	let points = []

	csvReadingsParser.on('readable', () => {
		let record
		while ((record = csvReadingsParser.read())) {
			logger.debug('* Record:', record)

			let timestamp = Date.now()
			let tags = {
				source: ITHO_MEASUREMENTS_READINGS_SOURCE,
				units: ITHO_MEASUREMENTS_READINGS_UNITS,
				location: location
			}

			_.forEach(ITHO_MEASUREMENTS_READINGS_DATASETS, dataset => {
				let fields = {}
				let isValid = false

				_.forEach(dataset, (field, idx, arr) => {
					let value = record[field]
					logger.debug(
						`* importCsvReadings for location ${location}: Field value (${field}):`,
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
						measurement: ITHO_MEASUREMENTS_READINGS_NAME,
						tags: tags,
						fields: fields
					})
				} else {
					console.warn(
						`! importCsvReadings for location ${location}: Ignoring dataset ${dataset} because of empty value`,
						record
					)
				}
			})
		}
	})

	csvReadingsParser.on('error', err => {
		logger.error(
			`Error occured while running CSV import (importCsvReadings) for location ${location}`,
			err.message
		)
	})

	csvReadingsParser.on('end', () => {
		logger.info(
			`Finished CSV import (importCsvReadings) for location ${location}`
		)
		store.addPoints(points)
	})

	streamifier.createReadStream(buffer).pipe(csvReadingsParser)
}

importCsvTemperatures = (location, buffer) => {
	logger.info(
		`Starting CSV import (importCsvTemperatures) for location ${location}`
	)

	const ITHO_MEASUREMENTS_TEMPERATURES_NAME =
		ITHO_MEASUREMENTS_PREFIX +
		config.itho.measurements.temperatures.measurement
	const ITHO_MEASUREMENTS_TEMPERATURES_UNITS =
		config.itho.measurements.temperatures.units
	const ITHO_MEASUREMENTS_TEMPERATURES_DELIMITER =
		config.itho.measurements.temperatures.delimiter
	const ITHO_MEASUREMENTS_TEMPERATURES_COLUMNS =
		config.itho.measurements.temperatures.columns
	const ITHO_MEASUREMENTS_TEMPERATURES_DATASETS =
		config.itho.measurements.temperatures.datasets
	const ITHO_MEASUREMENTS_TEMPERATURES_SOURCE =
		config.itho.measurements.temperatures.source

	const csvTemperaturesParser = parse({
		delimiter: ITHO_MEASUREMENTS_TEMPERATURES_DELIMITER,
		from_line: 2,
		relax_column_count: true,
		columns: ITHO_MEASUREMENTS_TEMPERATURES_COLUMNS
	})

	let points = []

	csvTemperaturesParser.on('readable', () => {
		let record
		while ((record = csvTemperaturesParser.read())) {
			logger.debug('* Record:', record)

			let timestamp = Date.now()
			let tags = {
				source: ITHO_MEASUREMENTS_TEMPERATURES_SOURCE,
				units: ITHO_MEASUREMENTS_TEMPERATURES_UNITS,
				location: location
			}

			_.forEach(ITHO_MEASUREMENTS_TEMPERATURES_DATASETS, dataset => {
				let fields = {}
				let isValid = false

				_.forEach(dataset, (field, idx, arr) => {
					let value = record[field]
					logger.debug(
						`* importCsvTemperatures for location ${location}: Field value (${field}):`,
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
						measurement: ITHO_MEASUREMENTS_TEMPERATURES_NAME,
						tags: tags,
						fields: fields
					})
				} else {
					console.warn(
						`! importCsvTemperatures for location ${location}: Ignoring dataset ${dataset} because of empty value`,
						record
					)
				}
			})
		}
	})

	csvTemperaturesParser.on('error', err => {
		logger.error(
			`Error occured while running CSV importy (importCsvTemperatures) for location ${location}`,
			err.message
		)
	})

	csvTemperaturesParser.on('end', () => {
		logger.info(
			`Finished CSV import (importCsvTemperatures) for location ${location}`
		)
		store.addPoints(points)
	})

	streamifier.createReadStream(buffer).pipe(csvTemperaturesParser)
}

module.exports = {
	importCsvReadings: importCsvReadings,
	importCsvTemperatures: importCsvTemperatures
}
