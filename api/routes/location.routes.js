const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')
const locationController = require('../controllers/location.controller')
const authController = require('../controllers/auth.controller')

// Retrieve all Locations
router
	.route('/')
	.get(jwt, authController.requestLogger, locationController.findAll)

// Retrieve Location by uuid
router
	.route('/:uuid')
	.get(jwt, authController.requestLogger, locationController.findByUuid)

module.exports = router
