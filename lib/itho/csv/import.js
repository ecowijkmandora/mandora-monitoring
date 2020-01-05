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
	const ITHO_CSV_MEASUREMENT_ENERGY_FIELDS =
		config.itho.csv.import.energy.fields
	const ITHO_CSV_MEASUREMENT_ENERGY_UNITS =
		config.itho.csv.import.energy.units
	const ITHO_CSV_IMPORT_SOURCE = config.itho.csv.import.source

	const csvEnergyParser = parse({
		delimiter: ITHO_CSV_DELIMITER,
		from_line: 2
	})

	let points = []

	csvEnergyParser.on('readable', () => {
		let record
		while ((record = csvEnergyParser.read())) {
			logger.debug('* Record:', record)

			let timestamp = Date.now()
			let tags = {
				source: ITHO_CSV_IMPORT_SOURCE,
				units: ITHO_CSV_MEASUREMENT_ENERGY_UNITS,
				location: location
			}

			_.forEach(ITHO_CSV_MEASUREMENT_ENERGY_FIELDS, fieldset => {
				let fields = {}
				let isValid = false

				_.forEach(fieldset, (field, idx, arr) => {
					let value = record[idx]
					logger.debug(`* Field value (${idx}) ${field}:`, value)

					switch (field) {
						case 'timestamp':
							timestamp = moment(
								value,
								'M/D/YYYY, h:mm:ss a'
							).toDate() // "7/30/2019, 2:00:00 AM"
							break
						case 'generated':
						case 'consumed':
							value = parseFloat(value.split(',').join(''))
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
						measurement: ITHO_CSV_MEASUREMENT_ENERGY_NAME,
						tags: tags,
						fields: fields
					})
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
	const ITHO_CSV_MEASUREMENT_TEMPERATURE_FIELDS =
		config.itho.csv.import.temperature.fields
	const ITHO_CSV_MEASUREMENT_TEMPERATURE_UNITS =
		config.itho.csv.import.temperature.units
	const ITHO_CSV_IMPORT_SOURCE = config.itho.csv.import.source

	const csvTemperatureParser = parse({
		delimiter: ITHO_CSV_DELIMITER,
		from_line: 2
	})

	let points = []

	csvTemperatureParser.on('readable', () => {
		let record
		while ((record = csvTemperatureParser.read())) {
			logger.debug('* Record:', record)

			let timestamp = Date.now()
			let tags = {
				source: ITHO_CSV_IMPORT_SOURCE,
				units: ITHO_CSV_MEASUREMENT_TEMPERATURE_UNITS,
				location: location
			}

			_.forEach(ITHO_CSV_MEASUREMENT_TEMPERATURE_FIELDS, fieldset => {
				let fields = {}
				let isValid = false

				_.forEach(fieldset, (field, idx, arr) => {
					let value = record[idx]
					logger.debug(`* Field value (${idx}) ${field}:`, value)

					switch (field) {
						case 'timestamp':
							timestamp = moment(
								value,
								'M/D/YYYY, h:mm:ss a'
							).toDate() // "7/30/2019, 2:00:00 AM"
							break
						case 'outdoor':
						case 'indoor':
						case 'setting':
						case 'boiler_high':
						case 'boiler_low':
							value = parseFloat(value.split(',').join(''))
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
						measurement: ITHO_CSV_MEASUREMENT_TEMPERATURE_NAME,
						tags: tags,
						fields: fields
					})
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
