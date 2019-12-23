const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')
const controller = require('../controllers/location.controller')

// Retrieve all Locations
router.get('/', jwt, controller.findAll)

// Retrieve Location by uuid
router.get('/:uuid', jwt, controller.findByUuid)

module.exports = router
