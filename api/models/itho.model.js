require('module-alias/register')
const config = require('@config')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const { escape } = require('influx')
const influx = store.influx

const ITHO_CSV_MEASUREMENT_PREFIX = config.itho.csv.import.measurementPrefix
const ITHO_CSV_MEASUREMENT_ENERGY_NAME =
	ITHO_CSV_MEASUREMENT_PREFIX + config.itho.csv.import.energy.measurement
const ITHO_CSV_MEASUREMENT_TEMPERATURE_NAME =
	ITHO_CSV_MEASUREMENT_PREFIX + config.itho.csv.import.temperature.measurement

class IthoEnergy {
	constructor() {}

	static getAllByUuid = (uuid, result) => {
		logger.debug(`IthoEnergy.getAllByUuid(${uuid})`)

		const query = `SELECT * FROM ${escape.measurement(
			ITHO_CSV_MEASUREMENT_ENERGY_NAME
		)} WHERE location = ${escape.stringLit(uuid)}
		ORDER BY time DESC`
		logger.debug('Using query:', query)

		influx
			.query(query)
			.then(res => {
				logger.debug('IthoEnergy.getAllByUuid(${uuid}): Found data')
				result(null, res)
			})
			.catch(err => {
				logger.error(
					`IthoEnergy.getAllByUuid(${uuid}): error occured`,
					err
				)
				result(err, null)
			})
	}
}

class IthoTemperature {
	constructor() {}

	static getAllByUuid = (uuid, result) => {
		logger.debug(`IthoTemperature.getAllByUuid(${uuid})`)

		const query = `SELECT * FROM ${escape.measurement(
			ITHO_CSV_MEASUREMENT_TEMPERATURE_NAME
		)} WHERE location = ${escape.stringLit(uuid)}
		ORDER BY time DESC`
		logger.debug('Using query:', query)

		influx
			.query(query)
			.then(res => {
				logger.debug(
					'IthoTemperature.getAllByUuid(${uuid}): Found data'
				)
				result(null, res)
			})
			.catch(err => {
				logger.error(
					`IthoTemperature.getAllByUuid(${uuid}): error occured`,
					err
				)
				result(err, null)
			})
	}
}

module.exports = {
	IthoEnergy: IthoEnergy,
	IthoTemperature: IthoTemperature
}
