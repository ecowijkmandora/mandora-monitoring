require('module-alias/register')
const config = require('@config')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const sql = store.mysql

class Installation {
	constructor(installation = {}) {
		this.id = installation.id
		this.location_uuid = installation.location_uuid
		this.ean_energy = installation.ean_energy
		this.ean_gas = installation.ean_gas
		this.energymeter = installation.energymeter
	}
}

Installation.getAll = result => {
	logger.debug(`Installation.getAll()`)

	sql.query(
		'SELECT location.uuid as location_uuid, ean_energy, ean_gas, energymeter FROM installations INNER JOIN location ON installations.location_id=location.id',
		(err, res) => {
			if (err) {
				logger.error(`Installation.getAll: error occured`, err)
				result(null, err)
				return
			}

			logger.debug('Found:', res)
			result(null, res)
		}
	)
}

module.exports = Installation
