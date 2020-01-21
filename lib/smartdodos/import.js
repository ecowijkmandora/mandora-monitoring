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
const SMARTDODOS_CSV_DELIMITER = config.smartdodos.csv.import.delimiter

importCsvEnergy = (location, buffer) => {
	logger.info(
		`Starting CSV import (importCsvEnergy) for location ${location}`
	)

	const SMARTDODOS_CSV_MEASUREMENT_ENERGY_NAME =
		SMARTDODOS_CSV_MEASUREMENT_PREFIX +
		config.smartdodos.csv.import.energy.measurement
	const SMARTDODOS_CSV_MEASUREMENT_ENERGY_FIELDS =
		config.smartdodos.csv.import.energy.fields
	const SMARTDODOS_CSV_MEASUREMENT_ENERGY_UNITS =
		config.smartdodos.csv.import.energy.units
	const SMARTDODOS_CSV_IMPORT_SOURCE = config.smartdodos.csv.import.source

	const csvEnergyParser = parse({
		delimiter: SMARTDODOS_CSV_DELIMITER,
		from_line: 2
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

			_.forEach(SMARTDODOS_CSV_MEASUREMENT_ENERGY_FIELDS, fieldset => {
				let fields = {}
				let isValid = false

				_.forEach(fieldset, (field, idx, arr) => {
					let value = record[idx]
					logger.debug(`* Field value (${idx}) ${field}:`, value)

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
						measurement: SMARTDODOS_CSV_MEASUREMENT_ENERGY_NAME,
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

module.exports = {
	importCsvEnergy: importCsvEnergy
}
