const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')

// Retrieve all Locations
router.get('/', jwt, (req, res) => {
	res.json([])
})

// Retrieve Location by uuid
router.get('/:uuid', jwt, (req, res) => {
	res.json({ uuid: req.params.uuid })
})

module.exports = router
