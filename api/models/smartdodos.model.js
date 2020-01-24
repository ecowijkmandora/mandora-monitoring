require('module-alias/register')
const config = require('@config')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const { escape } = require('influx')
const influx = store.influx

const SMARTDODOS_MEASUREMENTS_PREFIX =
	config.smartdodos.measurements.measurementPrefix
const SMARTDODOS_MEASUREMENTS_READINGS_NAME =
	SMARTDODOS_MEASUREMENTS_PREFIX +
	config.smartdodos.measurements.readings.measurement
const SMARTDODOS_MEASUREMENTS_USAGES_NAME =
	SMARTDODOS_MEASUREMENTS_PREFIX +
	config.smartdodos.measurements.usages.measurement

class SmartdodosReadings {
	constructor() {}

	static getAllByUuid = (uuid, result) => {
		logger.debug(`SmartdodosReadings.getAllByUuid(${uuid})`)

		const query = `SELECT consumed,generated FROM ${escape.measurement(
			SMARTDODOS_MEASUREMENTS_READINGS_NAME
		)} WHERE location = ${escape.stringLit(uuid)} ORDER BY time DESC`
		logger.debug('Using query:', query)

		influx
			.query(query)
			.then(res => {
				logger.debug('SmartdodosReadings.getAllByUuid: Found data')
				result(null, res)
			})
			.catch(err => {
				logger.error(
					`SmartdodosReadings.getAllByUuid: error occured`,
					err
				)
				//res.status(500).send(err.stack)
				result(err, null)
			})
	}
}

class SmartdodosUsages {
	constructor() {}

	static getAllByUuid = (uuid, result) => {
		logger.debug(`SmartdodosUsages.getAllByUuid(${uuid})`)

		const query = `SELECT consumed,generated FROM ${escape.measurement(
			SMARTDODOS_MEASUREMENTS_USAGES_NAME
		)} WHERE location = ${escape.stringLit(uuid)} ORDER BY time DESC`
		logger.debug('Using query:', query)

		influx
			.query(query)
			.then(res => {
				logger.debug('SmartdodosUsages.getAllByUuid: Found data')
				result(null, res)
			})
			.catch(err => {
				logger.error(`SmartdodosUsages.getAllByUuid: error occured`, err)
				//res.status(500).send(err.stack)
				result(err, null)
			})
	}
}

module.exports = {
	SmartdodosReadings: SmartdodosReadings,
	SmartdodosUsages: SmartdodosUsages
}
