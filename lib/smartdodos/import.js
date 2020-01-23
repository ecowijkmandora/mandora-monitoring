require('module-alias/register')
const config = require('@config')

const parse = require('csv-parse')
const _ = require('lodash')
const moment = require('moment')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const streamifier = require('streamifier')

const SMARTDODOS_CSV_MEASUREMENT_PREFIX =
	config.smartdodos.csv.import.measurementPrefix

importCsvEnergy = (location, buffer) => {
	logger.info(
		`Starting CSV import (importCsvEnergy) for location ${location}`
	)

	const SMARTDODOS_CSV_MEASUREMENT_ENERGY_NAME =
		SMARTDODOS_CSV_MEASUREMENT_PREFIX +
		config.smartdodos.csv.import.energy.measurement
	const SMARTDODOS_CSV_MEASUREMENT_ENERGY_COLUMNS =
		config.smartdodos.csv.import.energy.columns
	const SMARTDODOS_CSV_MEASUREMENT_ENERGY_DATASETS =
		config.smartdodos.csv.import.energy.datasets
	const SMARTDODOS_CSV_MEASUREMENT_ENERGY_UNITS =
		config.smartdodos.csv.import.energy.units
	const SMARTDODOS_CSV_MEASUREMENT_ENERGY_DELIMITER =
		config.smartdodos.csv.import.energy.delimiter

	const SMARTDODOS_CSV_IMPORT_SOURCE = config.smartdodos.csv.import.source

	const csvEnergyParser = parse({
		delimiter: SMARTDODOS_CSV_MEASUREMENT_ENERGY_DELIMITER,
		from_line: 2,
		relax_column_count: true,
		columns: SMARTDODOS_CSV_MEASUREMENT_ENERGY_COLUMNS
	})

	let points = []

	csvEnergyParser.on('readable', () => {
		let record
		while ((record = csvEnergyParser.read())) {
			logger.debug('* Record:', record)

			let timestamp = Date.now()
			let tags = {
				source: SMARTDODOS_CSV_IMPORT_SOURCE,
				units: SMARTDODOS_CSV_MEASUREMENT_ENERGY_UNITS,
				location: location
			}

			_.forEach(SMARTDODOS_CSV_MEASUREMENT_ENERGY_DATASETS, dataset => {
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
						measurement: SMARTDODOS_CSV_MEASUREMENT_ENERGY_NAME,
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

importCsvUsage = (location, buffer) => {
	logger.info(`Starting CSV import (importCsvUsage) for location ${location}`)

	const SMARTDODOS_CSV_MEASUREMENT_USAGE_NAME =
		SMARTDODOS_CSV_MEASUREMENT_PREFIX +
		config.smartdodos.csv.import.usage.measurement
	const SMARTDODOS_CSV_MEASUREMENT_USAGE_COLUMNS =
		config.smartdodos.csv.import.usage.columns
	const SMARTDODOS_CSV_MEASUREMENT_USAGE_DATASETS =
		config.smartdodos.csv.import.usage.datasets
	const SMARTDODOS_CSV_MEASUREMENT_USAGE_UNITS =
		config.smartdodos.csv.import.usage.units
	const SMARTDODOS_CSV_MEASUREMENT_USAGE_DELIMITER =
		config.smartdodos.csv.import.usage.delimiter

	const SMARTDODOS_CSV_IMPORT_SOURCE = config.smartdodos.csv.import.source

	const csvUsageParser = parse({
		delimiter: SMARTDODOS_CSV_MEASUREMENT_USAGE_DELIMITER,
		from_line: 2,
		relax_column_count: true,
		columns: SMARTDODOS_CSV_MEASUREMENT_USAGE_COLUMNS
	})

	let points = []

	csvUsageParser.on('readable', () => {
		let record
		while ((record = csvUsageParser.read())) {
			logger.debug('* Record:', record)

			let timestamp = Date.now()
			let tags = {
				source: SMARTDODOS_CSV_IMPORT_SOURCE,
				units: SMARTDODOS_CSV_MEASUREMENT_USAGE_UNITS,
				location: location
			}

			_.forEach(SMARTDODOS_CSV_MEASUREMENT_USAGE_DATASETS, dataset => {
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
						measurement: SMARTDODOS_CSV_MEASUREMENT_USAGE_NAME,
						tags: tags,
						fields: fields
					})
				}
			})
		}
	})

	csvUsageParser.on('error', err => {
		logger.error(
			`Error occured while running CSV import (importCsvUsage) for location ${location}`,
			err.message
		)
	})

	csvUsageParser.on('end', () => {
		logger.info(
			`Finished CSV import (importCsvUsage) for location ${location}`
		)
		store.addPoints(points)
	})

	streamifier.createReadStream(buffer).pipe(csvUsageParser)
}

module.exports = {
	importCsvEnergy: importCsvEnergy,
	importCsvUsage: importCsvUsage
}
