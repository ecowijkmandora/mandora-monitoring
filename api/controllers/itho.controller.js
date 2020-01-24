require('module-alias/register')
const config = require('@config')
const logger = require('@lib/logger')
const itho = require('@lib/itho')
const _ = require('lodash')
const Location = require('@api/models/location.model')
const { IthoReadings, IthoTemperatures } = require('@api/models/itho.model')

const ITHO_MEASUREMENTS_PREFIX = config.itho.measurements.measurementPrefix
const ITHO_MEASUREMENTS_READINGS_NAME =
	ITHO_MEASUREMENTS_PREFIX + config.itho.measurements.readings.measurement
const ITHO_MEASUREMENTS_TEMPERATURES_NAME =
	ITHO_MEASUREMENTS_PREFIX + config.itho.measurements.temperatures.measurement

const ITHO_MEASUREMENTS_READINGS_UNITS = config.itho.measurements.readings.units
const ITHO_MEASUREMENTS_TEMPERATURES_UNITS =
	config.itho.measurements.temperatures.units

exports.exportReadings = (req, res, next) => {
	const uuid = req.params.uuid

	if (!uuid) {
		res.status(500).json({
			error: 'No location UUID provided in request.'
		})
		return
	}

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
			IthoReadings.getAllByUuid(uuid, (err, data) => {
				if (err) {
					if (err.kind === 'not_found') {
						// 404
						logger.warn(
							`Did not find any Itho readings for UUID "${uuid}"`
						)
					}
					next()
				} else {
					res.status(200).json({
						location: uuid,
						measurement: ITHO_MEASUREMENTS_READINGS_NAME,
						units: ITHO_MEASUREMENTS_READINGS_UNITS,
						points: data
					})
				}
			})
		}
	})
}

exports.exportTemperatures = (req, res, next) => {
	const uuid = req.params.uuid

	if (!uuid) {
		res.status(500).json({
			error: 'No location UUID provided in request.'
		})
		return
	}

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
			IthoTemperatures.getAllByUuid(uuid, (err, data) => {
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
						location: uuid,
						measurement: ITHO_MEASUREMENTS_TEMPERATURES_NAME,
						units: ITHO_MEASUREMENTS_TEMPERATURES_UNITS,
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

	const uuid = req.params.uuid

	if (!uuid) {
		res.status(500).json({
			error: 'No location UUID provided in request.'
		})
		return
	}

	const readings = files.readings
	const temperatures = files.temperatures

	if (readings) {
		_.forEach(readings, file => {
			const buffer = file.buffer
			itho.csv.importCsvReadings(uuid, buffer)
		})
	}

	if (temperatures) {
		_.forEach(temperatures, file => {
			const buffer = file.buffer
			itho.csv.importCsvTemperatures(uuid, buffer)
		})
	}

	res.status(200).json({
		message: 'Import started.'
	})
}

exports.bulkImportCsvReadings = (req, res, next) => {
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
		itho.csv.importCsvReadings(uuid, buffer)
	}

	res.status(200).json({
		message: 'Import started.'
	})
}

exports.bulkImportCsvTemperatures = (req, res, next) => {
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
		itho.csv.importCsvTemperatures(uuid, buffer)
	}

	res.status(200).json({
		message: 'Import started.'
	})
}
