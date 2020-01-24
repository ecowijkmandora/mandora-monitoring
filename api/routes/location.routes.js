require('module-alias/register')
const Express = require('express')
const router = Express.Router()
const jwt = require('@api/jwt')
const locationController = require('@api/controllers/location.controller')
const authController = require('@api/controllers/auth.controller')

// Retrieve all Locations
router
	.route('/')
	.get(jwt, authController.requestLogger, locationController.findAll)

// Retrieve Location by uuid
router.get(
	'/:uuid',
	jwt,
	authController.requestLogger,
	locationController.findByUuid
)

module.exports = router
