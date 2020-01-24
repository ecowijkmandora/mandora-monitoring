require('module-alias/register')
const config = require('@config')
const logger = require('@lib/logger')
const smartdodos = require('@lib/smartdodos')
const _ = require('lodash')
const Installation = require('@api/models/installation.model')
const Location = require('@api/models/location.model')
const {
	SmartdodosReadings,
	SmartdodosUsages
} = require('@api/models/smartdodos.model')
const request = require('request')
const throttledRequest = require('throttled-request')(request)

throttledRequest.configure({
	requests: 2,
	milliseconds: 5000
})

const SMARTDODOS_API_APP_READINGS_SERVICE_URL =
	config.smartdodos.api.app.baseUrl + config.smartdodos.api.app.readingService
const SMARTDODOS_API_APP_PARAMETERS_ACCESS_TOKEN =
	config.smartdodos.api.app.parameterAccessToken
const SMARTDODOS_API_APP_PARAMETERS_MONTH =
	config.smartdodos.api.app.parameterMonth
const SMARTDODOS_API_APP_PARAMETERS_EAN = config.smartdodos.api.app.parameterEan

const SMARTDODOS_API_UMETER_USAGES_SERVICE_URL =
	config.smartdodos.api.umeter.baseUrl +
	config.smartdodos.api.umeter.usageService

const SMARTDODOS_MEASUREMENTS_PREFIX =
	config.smartdodos.measurements.measurementPrefix
const SMARTDODOS_MEASUREMENTS_READINGS_NAME =
	SMARTDODOS_MEASUREMENTS_PREFIX +
	config.smartdodos.measurements.readings.measurement
const SMARTDODOS_MEASUREMENTS_READINGS_UNITS =
	config.smartdodos.measurements.readings.units
const SMARTDODOS_MEASUREMENTS_USAGES_NAME =
	SMARTDODOS_MEASUREMENTS_PREFIX +
	config.smartdodos.measurements.usages.measurement
const SMARTDODOS_MEASUREMENTS_USAGES_UNITS =
	config.smartdodos.measurements.usages.units

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
			SmartdodosReadings.getAllByUuid(uuid, (err, data) => {
				if (err) {
					if (err.kind === 'not_found') {
						// 404
						logger.warn(
							`Did not find any Smartdodos readings for UUID "${uuid}"`
						)
					}
					next()
				} else {
					res.status(200).json({
						location: uuid,
						measurement: SMARTDODOS_MEASUREMENTS_READINGS_NAME,
						units: SMARTDODOS_MEASUREMENTS_READINGS_UNITS,
						points: data
					})
				}
			})
		}
	})
}

exports.exportUsages = (req, res, next) => {
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
			SmartdodosUsages.getAllByUuid(uuid, (err, data) => {
				if (err) {
					if (err.kind === 'not_found') {
						// 404
						logger.warn(
							`Did not find any Smartdodos usages for UUID "${uuid}"`
						)
					}
					next()
				} else {
					res.status(200).json({
						location: uuid,
						measurement: SMARTDODOS_MEASUREMENTS_USAGES_NAME,
						units: SMARTDODOS_MEASUREMENTS_USAGES_UNITS,
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

	const readings = files.readings
	const usages = files.usages

	if (readings) {
		_.forEach(readings, file => {
			const buffer = file.buffer
			smartdodos.csv.importCsvReadings(uuid, buffer)
		})
	}

	if (usages) {
		_.forEach(usages, file => {
			const buffer = file.buffer
			smartdodos.csv.importCsvUsages(uuid, buffer)
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
		smartdodos.csv.importCsvReadings(uuid, buffer)
	}

	res.status(200).json({
		message: 'Import started.'
	})
}

exports.bulkImportCsvUsages = (req, res, next) => {
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
		smartdodos.csv.importCsvUsages(uuid, buffer)
	}

	res.status(200).json({
		message: 'Import started.'
	})
}

exports.apiReadings = async (req, res, next) => {
	const accessToken = await smartdodos.auth.getApiAccessToken()
	const month = req.body[SMARTDODOS_API_APP_PARAMETERS_MONTH]

	let months = []
	if (Array.isArray(month)) {
		months = [...month]
	} else {
		months.push(month)
	}

	// Retrieve all EANs to query from the API
	Installation.getAll((err, data) => {
		if (err) {
			if (err.kind === 'not_found') {
				// 404
				logger.warn(`Unable to find locations`)
			}
			next()
		} else {
			for (let installation of data) {
				const ean = installation.ean_energy
				const uuid = installation.location_uuid

				// Retrieve reading data if we have a valid EAN number
				if (!isNaN(ean)) {
					_.forEach(months, async (month, idx, arr) => {
						const url = encodeURI(
							`${SMARTDODOS_API_APP_READINGS_SERVICE_URL}?${SMARTDODOS_API_APP_PARAMETERS_EAN}=${ean}&${SMARTDODOS_API_APP_PARAMETERS_MONTH}=${month}&${SMARTDODOS_API_APP_PARAMETERS_ACCESS_TOKEN}=${accessToken}`
						)
						logger.debug(
							`Fetching reading data from SmartDodos API: ${url}`
						)

						throttledRequest(
							url,
							{
								encoding: null // We want the CSV in a buffer
							},
							(err, res, buffer) => {
								if (err) {
									logger.error(
										'Unable to retrieve CSV from SmartDodos API:',
										err.message
									)
									return
								}
								//logger.debug('CSV', body)
								logger.debug(
									'Retrieved a CSV from SmartDodos API'
								) // ,buffer.toString())
								smartdodos.csv.importCsvReadings(uuid, buffer)
							}
						)
					})
				}
			}
			next()
		}
	})

	res.status(200).json({
		message: 'Import started.'
	})
}

exports.apiUsages = async (req, res, next) => {
	const accessToken = await smartdodos.auth.getApiAccessToken()
	const month = req.body[SMARTDODOS_API_APP_PARAMETERS_MONTH]

	let months = []
	if (Array.isArray(month)) {
		months = [...month]
	} else {
		months.push(month)
	}

	// Retrieve all EANs to query from the API
	Installation.getAll((err, data) => {
		if (err) {
			if (err.kind === 'not_found') {
				// 404
				logger.warn(`Unable to find locations`)
			}
			next()
		} else {
			for (let installation of data) {
				const ean = installation.ean_energy
				const uuid = installation.location_uuid

				// Retrieve reading data if we have a valid EAN number
				if (!isNaN(ean)) {
					_.forEach(months, async (month, idx, arr) => {
						const url = encodeURI(
							`${SMARTDODOS_API_UMETER_USAGES_SERVICE_URL}/${ean}/${month}`
						)
						logger.debug(
							`Fetching reading data from SmartDodos API: ${url}`
						)

						throttledRequest(
							url,
							{
								encoding: null, // We want the CSV in a buffer
								headers: {
									Authorization: `bearer ${accessToken}`
								}
							},
							(err, res, buffer) => {
								if (err) {
									logger.error(
										'Unable to retrieve CSV from SmartDodos API:',
										err.message
									)
									return
								}
								//logger.debug('CSV', body)
								logger.debug(
									'Retrieved a CSV from SmartDodos API'
								) // ,buffer.toString())
								smartdodos.csv.importCsvUsages(uuid, buffer)
							}
						)
					})
				}
			}
			next()
		}
	})

	res.status(200).json({
		message: 'Import started.'
	})
}
