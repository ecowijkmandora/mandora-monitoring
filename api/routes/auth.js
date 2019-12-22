const Express = require('express')
const router = Express.Router()
const authCtrl = require('../controllers/auth')
const jwt = require('../jwt')

router
	.route('/token')
	/** POST /api/auth/token Get JWT authentication token */
	.post(authCtrl.authenticate, authCtrl.generateToken, authCtrl.respondJWT)

/** GET /protected - Test service JWT authentication **/
router.get('/check', jwt, (req, res) =>
	res.json({
		jwt: 'ok'
	})
)

module.exports = router
