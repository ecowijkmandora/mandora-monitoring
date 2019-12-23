const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')
const controller = require('../controllers/auth.controller')

// Generate JWT token using username/password credentials
router
	.route('/token')
	.post(controller.authenticate, controller.generateToken, controller.respondJWT)

// Check whether JWT token is valed
router.get('/check', jwt, (req, res) => res.json(req.auth))

module.exports = router
