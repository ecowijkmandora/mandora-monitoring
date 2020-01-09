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

class SmartdodosEnergy {
	constructor() {}

	static getAllByUuid = (uuid, result) => {
		logger.debug(`SmartdodosEnergy.getAllByUuid(${uuid})`)

		const query = `SELECT * FROM ${escape.measurement(
			SMARTDODOS_CSV_MEASUREMENT_ENERGY_NAME
		)} WHERE location = ${escape.stringLit(uuid)} ORDER BY time DESC`
		logger.debug('Using query:', query)

		influx
			.query(query)
			.then(res => {
				logger.debug(
					'SmartdodosEnergy.getAllByUuid(${uuid}): Found data'
				)
				result(null, res)
			})
			.catch(err => {
				logger.error(
					`SmartdodosEnergy.getAllByUuid(${uuid}): error occured`,
					err
				)
				//res.status(500).send(err.stack)
				result(err, null)
			})
	}
}

module.exports = {
	SmartdodosEnergy: SmartdodosEnergy
}
