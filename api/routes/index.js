const Express = require('express')
const router = Express.Router()
const authRoutes = require('./auth')

/** GET / - Default response (info) **/
router.get('/', (req, res) => {
	res.json(['Hello', 'World'])
})

/** GET /status - Check service status **/
router.get('/status', (req, res) =>
	res.json({
		status: 'ok'
	})
)

/** Append authentication/authorization routes **/
router.use('/auth', authRoutes)

module.exports = router
