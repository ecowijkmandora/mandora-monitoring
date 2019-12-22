require('module-alias/register')
const config = require('@config')

const jwt = require('express-jwt')

const JWT_SHARED_SECRET = config.api.jwt.sharedSecret

const authenticate = jwt({
	secret: JWT_SHARED_SECRET, 
	requestProperty: 'auth'
})

module.exports = authenticate
