const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')
const authController = require('../controllers/auth.controller')

// Generate JWT token using username/password credentials
router
	.route('/token')
	.post(
		authController.authenticate,
		authController.generateToken,
		authController.respondJWT
	)

// Check whether JWT token is valed
router
	.route('/check')
	.get(jwt, authController.requestLogger, (req, res) => res.json(req.auth))

// Check whether user has admin privileges
router.route('/isadmin').get(
	jwt,
	authController.requestLogger,
	authController.adminAuthorizationRequired,
	(req, res) => res.json({
		status: 'ok'
	})
)

module.exports = router
