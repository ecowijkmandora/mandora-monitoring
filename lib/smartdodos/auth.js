require('module-alias/register')
const config = require('@config')
const axios = require('axios')
const querystring = require('querystring');
const logger = require('@lib/logger')

const SMARTDODOS_AUTH_BASEURL = config.smartdodos.auth.baseUrl
const SMARTDODOS_AUTH_TOKEN_SERVICE = config.smartdodos.auth.tokenService
const SMARTDODOS_AUTH_URL =
	SMARTDODOS_AUTH_BASEURL + SMARTDODOS_AUTH_TOKEN_SERVICE

const formData = {
	grant_type: 'password',
	userName: process.env.SMARTDODOS_USERNAME,
	password: process.env.SMARTDODOS_PASSWORD
}

const getApiToken = async () => {
	logger.debug('Requesting SmartDodos API token:', SMARTDODOS_AUTH_URL)

	try {
		const response = await axios.post(SMARTDODOS_AUTH_URL, querystring.stringify(formData))
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
	getApiToken: getApiToken
}
