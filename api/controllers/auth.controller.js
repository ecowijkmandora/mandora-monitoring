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
		if ((users.findIndex(obj => obj.user === username) == -1)) {
			// User does hot exist in InfluxDB yet
			logger.debug(`User ${username} does not exist in InfluxDB`)

			// Create user
			await store.influx.createUser(username, password, false).then(() => {
				logger.debug(
					`Created InfluxDB credentials for user ${username}`
				)
			})
		}

		// Update password to match current credentials
		store.influx.setPassword(username, password).then(() => {
			logger.debug(`Updated InfluxDB password for user ${username}`)
		})

		// Revoke READ privilege when user is not active
		if (data.active) {
			logger.debug(
				`User ${username} is active. Granting READ privilege in InfluxDB.`
			)
			store.influx.grantPrivilege(username, 'READ').then(() => {
				logger.debug(
					`Granted READ privilege in InfluxDB for user ${username}`
				)
			})
		} else {
			logger.debug(
				`User ${username} is not active. Revoking READ privilege in InfluxDB.`
			)
			store.influx.revokePrivilege(username, 'READ').then(() => {
				logger.debug(
					`Revoked READ privilege in InfluxDB for user ${username}`
				)
			})
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

module.exports = {
	authenticate: authenticate,
	generateToken: generateToken,
	respondJWT: respondJWT
}
