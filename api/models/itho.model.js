require('module-alias/register')
const config = require('@config')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const { escape } = require('influx')
const influx = store.influx

const ITHO_MEASUREMENTS_PREFIX = config.itho.measurements.measurementPrefix
const ITHO_MEASUREMENTS_READINGS_NAME =
	ITHO_MEASUREMENTS_PREFIX + config.itho.measurements.readings.measurement
const ITHO_MEASUREMENTS_TEMPERATURES_NAME =
	ITHO_MEASUREMENTS_PREFIX + config.itho.measurements.temperatures.measurement

class IthoReadings {
	constructor() {}

	static getAllByUuid = (uuid, result) => {
		logger.debug(`IthoReadings.getAllByUuid(${uuid})`)

		const query = `SELECT consumed,generated FROM ${escape.measurement(
			ITHO_MEASUREMENTS_READINGS_NAME
		)} WHERE location = ${escape.stringLit(uuid)}
		ORDER BY time DESC`
		logger.debug('Using query:', query)

		influx
			.query(query)
			.then(res => {
				logger.debug('IthoReadings.getAllByUuid(${uuid}): Found data')
				result(null, res)
			})
			.catch(err => {
				logger.error(
					`IthoReadings.getAllByUuid(${uuid}): error occured`,
					err
				)
				result(err, null)
			})
	}
}

class IthoTemperatures {
	constructor() {}

	static getAllByUuid = (uuid, result) => {
		logger.debug(`IthoTemperatures.getAllByUuid(${uuid})`)

		const query = `SELECT indoor,outdoor,setting,boiler_low,boiler_high FROM ${escape.measurement(
			ITHO_MEASUREMENTS_TEMPERATURES_NAME
		)} WHERE location = ${escape.stringLit(uuid)}
		ORDER BY time DESC`
		logger.debug('Using query:', query)

		influx
			.query(query)
			.then(res => {
				logger.debug(
					'IthoTemperatures.getAllByUuid(${uuid}): Found data'
				)
				result(null, res)
			})
			.catch(err => {
				logger.error(
					`IthoTemperatures.getAllByUuid(${uuid}): error occured`,
					err
				)
				result(err, null)
			})
	}
}

module.exports = {
	IthoReadings: IthoReadings,
	IthoTemperatures: IthoTemperatures
}
