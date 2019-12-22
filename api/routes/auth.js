const Express = require('express')
const router = Express.Router()
const authCtrl = require('../controllers/auth')
const jwt = require('../jwt')

// Generate JWT token using username/password credentials
router
	.route('/token')
	.post(authCtrl.authenticate, authCtrl.generateToken, authCtrl.respondJWT)

// Check whether JWT token is valed
router.get('/check', jwt, (req, res) => res.json(req.auth))

// Update password
router.put('/password', jwt, (req, res) => {
	if (!req.body) {
		res.status(400).send({
			message: 'Content can not be empty!'
		})
	}

	res.json({
		result: 'ok'
	})
})

module.exports = router
