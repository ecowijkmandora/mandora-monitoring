require('module-alias/register')
const config = require('@config')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const sql = store.mysql
const MYSQL_AES_KEY = config.data.mysql.aesKey
const MYSQL_TABLE_USER = 'user'

class User {
	constructor(user = {}) {
		this.email = user.email
		this.username = user.username
		this.password = user.password
		this.active = user.active
		this.first_name = user.first_name
		this.last_name = user.last_name
	}

	static findById = (userId, result) => {
		sql.query(`SELECT * FROM ${MYSQL_TABLE_USER} WHERE id = ${userId}`, (err, res) => {
			if (err) {
				logger.error(
					`Error occured while querying user by id ${userId}: `,
					err
				)
				result(err, null)
				return
			}

			if (res.length) {
				logger.debug('Found user by id: ', res[0])
				result(null, res[0])
				return
			}

			logger.debug(`Did not find user by id "${userId}"`)
			result({ kind: 'not_found' }, null)
		})
	}

	static findByUsername = (username, result) => {
		sql.query(
			`SELECT * FROM ${MYSQL_TABLE_USER} WHERE username = '${username}'`,
			(err, res) => {
				if (err) {
					logger.error(
						`Error occured while querying user by username "${username}":`,
						err
					)
					result(err, null)
					return
				}

				if (res.length) {
					logger.log(
						'debug',
						`Found user by username "${username}"`,
						res[0]
					)
					result(null, res[0])
					return
				}

				logger.debug(`Did not find user by username "${username}"`)
				result({ kind: 'not_found' }, null)
			}
		)
	}

	static findByCredentials = (username, password, result) => {
		sql.query(
			`SELECT * FROM ${MYSQL_TABLE_USER} WHERE username = '${username}' AND AES_DECRYPT(password, '${MYSQL_AES_KEY}') = '${password}'`,
			(err, res) => {
				if (err) {
					logger.error(
						`Unable to find user "${username}" by credentials:`,
						err
					)
					result(err, null)
					return
				}

				if (res.length) {
					logger.debug(`Found user "${username}" by credentials`)
					result(null, res[0])
					return
				}

				logger.info(`Did not find user "${username}" by credentials`)
				result({ kind: 'not_found' }, null)
			}
		)
	}
}

module.exports = User
