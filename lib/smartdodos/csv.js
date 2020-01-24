require('module-alias/register')
const config = require('@config')
const parse = require('csv-parse')
const _ = require('lodash')
const moment = require('moment')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const streamifier = require('streamifier')

const SMARTDODOS_MEASUREMENTS_PREFIX =
	config.smartdodos.measurements.measurementPrefix

importCsvReadings = (location, buffer) => {
	logger.info(
		`Starting CSV import (importCsvReadings) for location ${location}`
	)

	const SMARTDODOS_MEASUREMENTS_READINGS_NAME =
		SMARTDODOS_MEASUREMENTS_PREFIX +
		config.smartdodos.measurements.readings.measurement
	const SMARTDODOS_MEASUREMENTS_READINGS_COLUMNS =
		config.smartdodos.measurements.readings.columns
	const SMARTDODOS_MEASUREMENTS_READINGS_DATASETS =
		config.smartdodos.measurements.readings.datasets
	const SMARTDODOS_MEASUREMENTS_READINGS_UNITS =
		config.smartdodos.measurements.readings.units
	const SMARTDODOS_MEASUREMENTS_READINGS_DELIMITER =
		config.smartdodos.measurements.readings.delimiter
	const SMARTDODOS_MEASUREMENTS_READINGS_SOURCE =
		config.smartdodos.measurements.readings.source

	const csvReadingsParser = parse({
		delimiter: SMARTDODOS_MEASUREMENTS_READINGS_DELIMITER,
		from_line: 2,
		relax_column_count: true,
		columns: SMARTDODOS_MEASUREMENTS_READINGS_COLUMNS
	})

	let points = []

	csvReadingsParser.on('readable', () => {
		let record
		while ((record = csvReadingsParser.read())) {
			logger.debug('* Record:', record)

			let timestamp = Date.now()
			let tags = {
				source: SMARTDODOS_MEASUREMENTS_READINGS_SOURCE,
				units: SMARTDODOS_MEASUREMENTS_READINGS_UNITS,
				location: location
			}

			_.forEach(SMARTDODOS_MEASUREMENTS_READINGS_DATASETS, dataset => {
				let fields = {}
				let isValid = false

				_.forEach(dataset, (field, idx, arr) => {
					let value = record[field]
					logger.debug(`* Field value (${field}):`, value)

					switch (field) {
						case 'timestamp':
							timestamp = moment(
								value,
								'DD-MM-YYYY h:mm'
							).toDate()
							break
						case 'generated':
						case 'consumed':
							value = parseInt(value)
							isValid = !isNaN(value)
							fields[field] = value
							break
						default:
							break
					}
				})

				if (isValid) {
					logger.debug('* Fields to store:', fields)
					points.push({
						timestamp: timestamp,
						measurement: SMARTDODOS_MEASUREMENTS_READINGS_NAME,
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

importCsvUsages = (location, buffer) => {
	logger.info(
		`Starting CSV import (importCsvUsages) for location ${location}`
	)

	const SMARTDODOS_MEASUREMENTS_USAGES_NAME =
		SMARTDODOS_MEASUREMENTS_PREFIX +
		config.smartdodos.measurements.usages.measurement
	const SMARTDODOS_MEASUREMENTS_USAGES_COLUMNS =
		config.smartdodos.measurements.usages.columns
	const SMARTDODOS_MEASUREMENTS_USAGES_DATASETS =
		config.smartdodos.measurements.usages.datasets
	const SMARTDODOS_MEASUREMENTS_USAGES_UNITS =
		config.smartdodos.measurements.usages.units
	const SMARTDODOS_MEASUREMENTS_USAGES_DELIMITER =
		config.smartdodos.measurements.usages.delimiter
	const SMARTDODOS_MEASUREMENTS_USAGES_SOURCE =
		config.smartdodos.measurements.usages.source

	const csvUsagesParser = parse({
		delimiter: SMARTDODOS_MEASUREMENTS_USAGES_DELIMITER,
		from_line: 2,
		relax_column_count: true,
		columns: SMARTDODOS_MEASUREMENTS_USAGES_COLUMNS
	})

	let points = []

	csvUsagesParser.on('readable', () => {
		let record
		while ((record = csvUsagesParser.read())) {
			logger.debug('* Record:', record)

			let timestamp = Date.now()
			let tags = {
				source: SMARTDODOS_MEASUREMENTS_USAGES_SOURCE,
				units: SMARTDODOS_MEASUREMENTS_USAGES_UNITS,
				location: location
			}

			_.forEach(SMARTDODOS_MEASUREMENTS_USAGES_DATASETS, dataset => {
				let fields = {}
				let isValid = false

				_.forEach(dataset, (field, idx, arr) => {
					let value = record[field]
					logger.debug(`* Field value (${field}):`, value)

					switch (field) {
						case 'timestamp':
							timestamp = moment(
								value,
								'DD-MM-YYYY h:mm'
							).toDate()
							break
						case 'generated':
						case 'consumed':
							value = parseInt(value)
							isValid = !isNaN(value)
							fields[field] = value
							break
						default:
							break
					}
				})

				if (isValid) {
					points.push({
						timestamp: timestamp,
						measurement: SMARTDODOS_MEASUREMENTS_USAGES_NAME,
						tags: tags,
						fields: fields
					})
				}
			})
		}
	})

	csvUsagesParser.on('error', err => {
		logger.error(
			`Error occured while running CSV import (importCsvUsages) for location ${location}`,
			err.message
		)
	})

	csvUsagesParser.on('end', () => {
		logger.info(
			`Finished CSV import (importCsvUsages) for location ${location}`
		)
		store.addPoints(points)
	})

	streamifier.createReadStream(buffer).pipe(csvUsagesParser)
}

module.exports = {
	importCsvReadings: importCsvReadings,
	importCsvUsages: importCsvUsages
}
