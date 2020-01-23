require('module-alias/register')
const config = require('@config')
const logger = require('@lib/logger')
const smartdodos = require('@lib/smartdodos')
const _ = require('lodash')
const util = require('util');
const Installation = require('@api/models/installation.model')
const Location = require('@api/models/location.model')
const { SmartdodosEnergy } = require('@api/models/smartdodos.model')
const request = require('request')
const throttledRequest = require('throttled-request')(request)

throttledRequest.configure({
	requests: 2,
	milliseconds: 1000
})

const SMARTDODOS_API_ENERGY_SERVICE_URL =
	config.smartdodos.api.baseUrl + config.smartdodos.api.energyService
const SMARTDODOS_API_PARAMETERS_ACCESS_TOKEN =
	config.smartdodos.api.parameterAccessToken
const SMARTDODOS_API_PARAMETERS_MONTH = config.smartdodos.api.parameterMonth
const SMARTDODOS_API_PARAMETERS_EAN = config.smartdodos.api.parameterEan

const SMARTDODOS_CSV_MEASUREMENT_PREFIX =
	config.smartdodos.csv.import.measurementPrefix
const SMARTDODOS_CSV_MEASUREMENT_ENERGY_NAME =
	SMARTDODOS_CSV_MEASUREMENT_PREFIX +
	config.smartdodos.csv.import.energy.measurement
const SMARTDODOS_CSV_MEASUREMENT_ENERGY_UNITS =
	config.smartdodos.csv.import.energy.units

exports.exportEnergy = (req, res, next) => {
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
			SmartdodosEnergy.getAllByUuid(uuid, (err, data) => {
				if (err) {
					if (err.kind === 'not_found') {
						// 404
						logger.warn(
							`Did not find any Smartdodos energy readings for UUID "${uuid}"`
						)
					}
					next()
				} else {
					res.status(200).json({
						location: uuid,
						measurement: SMARTDODOS_CSV_MEASUREMENT_ENERGY_NAME,
						units: SMARTDODOS_CSV_MEASUREMENT_ENERGY_UNITS,
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

	const energy = files.energy

	if (energy) {
		_.forEach(energy, file => {
			const buffer = file.buffer
			smartdodos.import.importCsvEnergy(uuid, buffer)
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
		smartdodos.import.importCsvEnergy(uuid, buffer)
	}

	res.status(200).json({
		message: 'Import started.'
	})
}

exports.apiReadings = async (req, res, next) => {
	const accessToken = await smartdodos.auth.getApiToken()
	const month = req.body[SMARTDODOS_API_PARAMETERS_MONTH]

	let months = []
	if (Array.isArray(month)) {
		months = [...month]
	} else {
		months.push(month)
	}

	// Retrieve all EANs to query from the API
	const installations = Installation.getAll((err, data) => {
		if (err) {
			if (err.kind === 'not_found') {
				// 404
				logger.warn(`Login attempt by unknown user "${username}"`)
			}
			next()
		} else {
			for (let installation of data) {
				const ean = installation.ean_energy
				const uuid = installation.location_uuid

				// Retrieve energy data if we have a valid EAN number
				if (!isNaN(ean)) {
					_.forEach(months, async (month, idx, arr) => {
						const url = apiUrl(ean, month, accessToken)
						logger.debug(
							`Fetching energy data from SmartDodos API: ${url}`
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
								smartdodos.import.importCsvEnergy(
									uuid,
									buffer
								)
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

const apiUrl = (ean, month, accessToken) => {
	const url = `${SMARTDODOS_API_ENERGY_SERVICE_URL}?${SMARTDODOS_API_PARAMETERS_EAN}=${ean}&${SMARTDODOS_API_PARAMETERS_MONTH}=${month}&${SMARTDODOS_API_PARAMETERS_ACCESS_TOKEN}=${accessToken}`
	return encodeURI(url)
}
