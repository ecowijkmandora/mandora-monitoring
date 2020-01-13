require('module-alias/register')
const config = require('@config')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const sql = store.mysql
const MYSQL_TABLE_LOCATION = 'location'
const MYSQL_TABLE_ADDRESS = 'address'

class Location {
	constructor(location = {}) {
		this.id = location.id
		this.uuid = location.uuid
		this.address_id = address_id
	}

	static getAll = result => {
		logger.debug(`Location.getAll()`)

		sql.query(
			`SELECT uuid, postalcode, housenumber, streetname, city FROM ${MYSQL_TABLE_LOCATION} INNER JOIN ${MYSQL_TABLE_ADDRESS} on ${MYSQL_TABLE_LOCATION}.${MYSQL_TABLE_ADDRESS}_id = ${MYSQL_TABLE_ADDRESS}.id`,
			(err, res) => {
				if (err) {
					logger.error(`Location.getAll: error occured`, err)
					result(null, err)
					return
				}

				logger.debug('Found:', res)
				result(null, res)
			}
		)
	}

	static getAllMandated = (username, result) => {
		logger.debug(`Location.getAllMandated()`)

		sql.query(
			`SELECT uuid, postalcode, housenumber, streetname, city 
			 FROM location
			 INNER JOIN address ON location.address_id = address.id
			 WHERE EXISTS (
				SELECT 1
				FROM user
				WHERE username = ? AND mandate_id IS NULL
			 ) OR location.uuid IN ( 
				SELECT location.uuid
				FROM user 
				INNER JOIN mandate ON user.mandate_id = mandate.id 
				LEFT OUTER JOIN mandate_location on mandate.id = mandate_location.mandate_id
				INNER JOIN location ON mandate_location.location_id = location.id
				INNER JOIN address ON location.address_id = address.id
				WHERE username = ?				
			 )`,
			[username, username],
			(err, res) => {
				if (err) {
					logger.error(`Location.getAllMandated: error occured`, err)
					result(null, err)
					return
				}

				logger.debug('Found:', res)
				result(null, res)
			}
		)
	}

	static findByUuid = (uuid, result) => {
		logger.debug(`Location.findByUuid(${uuid})`)

		sql.query(
			`SELECT uuid, postalcode, housenumber, streetname, city FROM ${MYSQL_TABLE_LOCATION} INNER JOIN ${MYSQL_TABLE_ADDRESS} on ${MYSQL_TABLE_LOCATION}.${MYSQL_TABLE_ADDRESS}_id = ${MYSQL_TABLE_ADDRESS}.id WHERE uuid = ?`,
			uuid,
			(err, res) => {
				if (err) {
					logger.error(`Location.findByUuid: error occured`, err)
					result(err, null)
					return
				}

				if (res.length) {
					logger.debug('Found:', res[0])
					result(null, res[0])
					return
				}

				logger.debug(`Not found`)
				result({ kind: 'not_found' }, null)
			}
		)
	}

	static findByUuidMandated = (username, uuid, result) => {
		logger.debug(`Location.findByUuidMandated(${uuid})`)

		sql.query(
			`SELECT uuid, postalcode, housenumber, streetname, city 
			 FROM location
			 INNER JOIN address ON location.address_id = address.id 
			 WHERE uuid = ? AND (
				EXISTS (
					SELECT 1
					FROM user
					WHERE username = ? AND mandate_id IS NULL
				) OR uuid IN ( 
					SELECT location.uuid
					FROM user 
					INNER JOIN mandate ON user.mandate_id = mandate.id 
					LEFT OUTER JOIN mandate_location on mandate.id = mandate_location.mandate_id
					INNER JOIN location ON mandate_location.location_id = location.id
					INNER JOIN address ON location.address_id = address.id
					WHERE username = ?				
				)			 
			 )`,
			[uuid, username, username],
			(err, res) => {
				if (err) {
					logger.error(
						`Location.findByUuidMandated: error occured`,
						err
					)
					result(err, null)
					return
				}

				if (res.length) {
					logger.debug('Found:', res[0])
					result(null, res[0])
					return
				}

				logger.debug(`Not found`)
				result({ kind: 'not_found' }, null)
			}
		)
	}
}

module.exports = Location
