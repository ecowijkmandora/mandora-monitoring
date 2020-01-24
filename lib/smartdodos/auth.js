require('module-alias/register')
const config = require('@config')
const axios = require('axios')
const querystring = require('querystring')
const logger = require('@lib/logger')

const SMARTDODOS_API_AUTH_URL =
	config.smartdodos.api.auth.baseUrl + config.smartdodos.api.auth.tokenService

const formData = {
	grant_type: 'password',
	userName: process.env.SMARTDODOS_USERNAME,
	password: process.env.SMARTDODOS_PASSWORD
}

const getApiAccessToken = async () => {
	logger.debug('Requesting SmartDodos API token:', SMARTDODOS_API_AUTH_URL)

	try {
		const response = await axios.post(
			SMARTDODOS_API_AUTH_URL,
			querystring.stringify(formData)
		)
		const data = response.data
		const token = data.access_token
		logger.debug('Success! Server responded with:', token)
		return token
	} catch (err) {
		logger.error('Unable to request SmartDodos API token:', err)
		return
	}
}

module.exports = {
	getApiAccessToken: getApiAccessToken
}
