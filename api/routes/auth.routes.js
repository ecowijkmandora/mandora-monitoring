const Express = require('express')
const router = Express.Router()
const auth = require('../controllers/auth.controller')
const jwt = require('../jwt')

// Generate JWT token using username/password credentials
router
	.route('/token')
	.post(auth.authenticate, auth.generateToken, auth.respondJWT)

// Check whether JWT token is valed
router.get('/check', jwt, (req, res) => res.json(req.auth))

module.exports = router
