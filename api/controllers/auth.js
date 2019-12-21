require('module-alias/register')
const config = require('@config')
const logger = require('@lib/logger')
const User = require('@api/models/user')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

const JWT_EXP_HOURS = 8
const JWT_SHARED_SECRET = config.api.jwt.sharedSecret

const authenticate = (req, res, next) => {
	const username = req.body.username
	const password = req.body.password

	User.findByUsername(username, (err, data) => {
		if (err) {
			if (err.kind === 'not_found') {
				// 404
				logger.warn(`Login attempt by unknown user ${username}`)
			}
			next()
		} else {
			User.findByCredentials(username, password, (err, data) => {
				if (err) {
					if (err.kind === 'not_found') {
						// 404
						logger.warn(`Login attempt failed (incorrect password) for user ${username}`)
					}
					next()
				} else {
					if (data.active) {
						req.user = data
						logger.info(`Authenticated user ${req.user.username}`)				
					} else {
						logger.warn(`Login attempt by inactive user ${username}`)
					}
		
					next()
				}
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
