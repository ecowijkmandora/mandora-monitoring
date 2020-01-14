require('module-alias/register')
const config = require('@config')
const { store } = require('@lib/data')
const logger = require('@lib/logger')
const User = require('@api/models/user.model')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

const {
	expiration: JWT_EXP_HOURS = 8,
	sharedSecret: JWT_SHARED_SECRET
} = config.api.jwt

const requestLogger = (req, res, next) => {
	logger.info(`Request URL: ${req.baseUrl}${req.path} [${req.auth.username}]`)
	next()
}

const authenticate = (req, res, next) => {
	const username = req.body.username
	const password = req.body.password

	User.findByUsername(username, (err, data) => {
		if (err) {
			if (err.kind === 'not_found') {
				// 404
				logger.warn(`Login attempt by unknown user "${username}"`)
			}
			next()
		} else {
			User.findByCredentials(username, password, (err, data) => {
				if (err) {
					if (err.kind === 'not_found') {
						// 404
						logger.warn(
							`Login attempt failed (incorrect password) for user "${username}"`
						)
					}
					next()
				} else {
					if (data.active) {
						req.user = data
						logger.info(`Authenticated user "${req.user.username}"`)
					} else {
						logger.warn(
							`Login attempt by inactive user "${username}"`
						)
					}

					// Check InfluxDB permissions for this user
					syncInfluxAuth(username, password, data)

					next()
				}
			})
		}
	})
}

const syncInfluxAuth = (username, password, data) => {
	logger.info('Syncing InfluxDB user credentials and privileges')

	store.influx.getUsers().then(async users => {
		if (users.findIndex(obj => obj.user === username) == -1) {
			// User does hot exist in InfluxDB
			logger.debug(`User ${username} does not exist in InfluxDB`)

			// Check if user is active and should have access to InfluxDB
			if (data.influx_access && data.active) {
				// Create user
				await store.influx
					.createUser(username, password, false)
					.then(() => {
						logger.debug(
							`Created InfluxDB credentials for active user ${username}`
						)
					})
			} else {
				// User does not exist in InfluxDB and should not be there
				logger.debug(
					`Not creating InfluxDB credentials for ${username}, unauthorized for InfluxDB`
				)
				return
			}
		}

		// User exists or has just been created
		if (!data.influx_access || !data.active) {
			// Drop existing user if it's inactive or should not have InfluxDB access

			store.influx.dropUser(username).then(() => {
				logger.debug(
					`Removed InfluxDB credentials for user ${username}`
				)
			})
		} else {
			// Update user details in InfluxDB for user that should have access

			// Update password to match current credentials
			store.influx.setPassword(username, password).then(() => {
				logger.debug(`Updated InfluxDB password for user ${username}`)
			})

			// Update privileges
			if (data.admin) {
				logger.debug(
					`User ${username} is an admin. Granting admin and WRITE privileges in InfluxDB.`
				)

				store.influx.grantAdminPrivilege(username).then(() => {
					logger.debug(
						`Granted administrator privilege in InfluxDB for user ${username}`
					)
				})

				store.influx.grantPrivilege(username, 'WRITE').then(() => {
					logger.debug(
						`Granted ALL privilege in InfluxDB for user ${username}`
					)
				})
			} else {
				logger.debug(
					`User ${username} is not an admin. Granting READ privilege in InfluxDB.`
				)

				store.influx.revokeAdminPrivilege(username).then(() => {
					logger.debug(
						`Revoked administrator privilege in InfluxDB for user ${username}`
					)
				})

				store.influx.grantPrivilege(username, 'READ').then(() => {
					logger.debug(
						`Granted READ privilege in InfluxDB for user ${username}`
					)
				})
			}
		}
	})
}

const generateToken = (req, res, next) => {
	if (!req.user) return next()

	const payload = {
		username: req.user.username
	}

	const options = {
		expiresIn: `${JWT_EXP_HOURS}h`
	}

	req.token = jwt.sign(payload, JWT_SHARED_SECRET, options)

	next()
}

const respondJWT = (req, res) => {
	if (!req.user) {
		res.status(401).json({
			error: 'Unauthorized'
		})
	} else {
		res.status(200).json({
			jwt: req.token
		})
	}
}

const adminAuthorizationRequired = (req, res, next) => {
	const username = req.auth.username
	if (!isAdmin(username)) {
		res.status(401).json({
			error: 'Unauthorized'
		})
	} else {
		// Use is authorized, continue middleware chain
		next()
	}
}

const isAdmin = async username => {
	await User.findByUsername(username, (err, data) => {
		if (err) {
			if (err.kind === 'not_found') {
				// 404
				logger.warn(`Checking admin authorization for unknown user "${username}"`)
			}
		} else {			
			if (data.admin) {				
				return true
			}
		}

		// User is not an admin
		logger.warn(`User ${username} is not an administrator.`)
		return false
	})
}

module.exports = {
	requestLogger: requestLogger,
	authenticate: authenticate,
	generateToken: generateToken,
	respondJWT: respondJWT,	
	adminAuthorizationRequired: adminAuthorizationRequired
}
