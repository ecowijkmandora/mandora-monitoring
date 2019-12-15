const Express = require('express')
const router = Express.Router()
const authCtrl = require('../controllers/auth')

router
	.route('/token')
	/** POST /api/auth/token Get JWT authentication token */
	.post(authCtrl.authenticate, authCtrl.generateToken, authCtrl.respondJWT)

module.exports = router
