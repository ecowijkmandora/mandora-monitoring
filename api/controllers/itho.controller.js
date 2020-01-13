require('module-alias/register')
const config = require('@config')
const logger = require('@lib/logger')
const itho = require('@lib/itho')
const _ = require('lodash')
const Location = require('@api/models/location.model')
const { IthoEnergy, IthoTemperature } = require('@api/models/itho.model')

const ITHO_CSV_MEASUREMENT_PREFIX = config.itho.csv.import.measurementPrefix
const ITHO_CSV_MEASUREMENT_ENERGY_NAME =
	ITHO_CSV_MEASUREMENT_PREFIX + config.itho.csv.import.energy.measurement
const ITHO_CSV_MEASUREMENT_TEMPERATURE_NAME =
	ITHO_CSV_MEASUREMENT_PREFIX + config.itho.csv.import.temperature.measurement

const ITHO_CSV_MEASUREMENT_ENERGY_UNITS = config.itho.csv.import.energy.units
const ITHO_CSV_MEASUREMENT_TEMPERATURE_UNITS =
	config.itho.csv.import.temperature.units

exports.exportEnergy = (req, res, next) => {
	const uuid = req.params.uuid

	Location.findByUuidMandated(req.auth.username, uuid, (err, data) => {
		if (err) {
			if (err.kind === 'not_found') {
				res.status(404).send({
					message: `Could not find location with uuid ${uuid}.`
				})
			}
			next()
		} else {
			// Address exists and is mandated
			IthoEnergy.getAllByUuid(uuid, (err, data) => {
				if (err) {
					if (err.kind === 'not_found') {
						// 404
						logger.warn(
							`Did not find any Itho energy readings for UUID "${uuid}"`
						)
					}
					next()
				} else {
					res.status(200).json({
						measurement: ITHO_CSV_MEASUREMENT_ENERGY_NAME,
						units: ITHO_CSV_MEASUREMENT_ENERGY_UNITS,
						points: data
					})
				}
			})
		}
	})
}

exports.exportTemperature = (req, res, next) => {
	const uuid = req.params.uuid

	Location.findByUuidMandated(req.auth.username, uuid, (err, data) => {
		if (err) {
			if (err.kind === 'not_found') {
				res.status(404).send({
					message: `Could not find location with uuid ${uuid}.`
				})
			}
			next()
		} else {
			// Address exists and is mandated
			IthoTemperature.getAllByUuid(uuid, (err, data) => {
				if (err) {
					if (err.kind === 'not_found') {
						// 404
						logger.warn(
							`Did not find any Itho temperature readings for UUID "${uuid}"`
						)
					}
					next()
				} else {
					res.status(200).json({
						measurement: ITHO_CSV_MEASUREMENT_TEMPERATURE_NAME,
						units: ITHO_CSV_MEASUREMENT_TEMPERATURE_UNITS,
						points: data
					})
				}
			})
		}
	})
}

exports.importCsv = (req, res, next) => {
	const files = req.files

	if (!files || files.length < 1) {
		res.status(500).json({
			error: 'No files uploaded.'
		})
		return
	}

	// TODO Check existance of location in MySQL
	const uuid = req.params.uuid

	const energy = files.energy
	const temperature = files.temperature

	if (energy) {
		_.forEach(energy, file => {
			const buffer = file.buffer
			itho.csv.import.importCsvEnergy(uuid, buffer)
		})
	}

	if (temperature) {
		_.forEach(temperature, file => {
			const buffer = file.buffer
			itho.csv.import.importCsvTemperature(uuid, buffer)
		})
	}

	res.status(200).json({
		message: 'Import started.'
	})
}

exports.bulkImportCsvEnergy = (req, res, next) => {
	const files = req.files

	if (!files || files.length < 1) {
		res.status(500).json({
			error: 'No files uploaded.'
		})
	}

	for (let file of files) {
		const uuid = file.fieldname
		// TODO Check existance of location in MySQL
		const buffer = file.buffer
		itho.csv.import.importCsvEnergy(uuid, buffer)
	}

	res.status(200).json({
		message: 'Import started.'
	})
}

exports.bulkImportCsvTemperature = (req, res, next) => {
	const files = req.files

	if (!files || files.length < 1) {
		res.status(500).json({
			error: 'No files uploaded.'
		})
	}

	for (let file of files) {
		const uuid = file.fieldname
		// TODO Check existance of location in MySQL
		const buffer = file.buffer
		itho.csv.import.importCsvTemperature(uuid, buffer)
	}

	res.status(200).json({
		message: 'Import started.'
	})
}
