require('module-alias/register')
const config = require('@config')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const { escape } = require('influx')
const influx = store.influx

const SMARTDODOS_CSV_MEASUREMENT_PREFIX =
	config.smartdodos.csv.import.measurementPrefix
const SMARTDODOS_CSV_MEASUREMENT_ENERGY_NAME =
	SMARTDODOS_CSV_MEASUREMENT_PREFIX +
	config.smartdodos.csv.import.energy.measurement
const SMARTDODOS_CSV_MEASUREMENT_USAGE_NAME =
	SMARTDODOS_CSV_MEASUREMENT_PREFIX +
	config.smartdodos.csv.import.usage.measurement

class SmartdodosEnergy {
	constructor() {}

	static getAllByUuid = (uuid, result) => {
		logger.debug(`SmartdodosEnergy.getAllByUuid(${uuid})`)

		const query = `SELECT consumed,generated FROM ${escape.measurement(
			SMARTDODOS_CSV_MEASUREMENT_ENERGY_NAME
		)} WHERE location = ${escape.stringLit(uuid)} ORDER BY time DESC`
		logger.debug('Using query:', query)

		influx
			.query(query)
			.then(res => {
				logger.debug('SmartdodosEnergy.getAllByUuid: Found data')
				result(null, res)
			})
			.catch(err => {
				logger.error(
					`SmartdodosEnergy.getAllByUuid: error occured`,
					err
				)
				//res.status(500).send(err.stack)
				result(err, null)
			})
	}
}

class SmartdodosUsage {
	constructor() {}

	static getAllByUuid = (uuid, result) => {
		logger.debug(`SmartdodosUsage.getAllByUuid(${uuid})`)

		const query = `SELECT consumed,generated FROM ${escape.measurement(
			SMARTDODOS_CSV_MEASUREMENT_USAGE_NAME
		)} WHERE location = ${escape.stringLit(uuid)} ORDER BY time DESC`
		logger.debug('Using query:', query)

		influx
			.query(query)
			.then(res => {
				logger.debug('SmartdodosUsage.getAllByUuid: Found data')
				result(null, res)
			})
			.catch(err => {
				logger.error(`SmartdodosUsage.getAllByUuid: error occured`, err)
				//res.status(500).send(err.stack)
				result(err, null)
			})
	}
}

module.exports = {
	SmartdodosEnergy: SmartdodosEnergy,
	SmartdodosUsage: SmartdodosUsage
}
