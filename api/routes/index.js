const Express = require('express')
const router = Express.Router()
const auth = require('./auth.routes')
const itho = require('./itho.routes')
const smartdodos = require('./smartdodos.routes')
const location = require('./location.routes')

router.get('/', (req, res) => {
	res.json({})
})

router.get('/status', (req, res) =>
	res.json({
		status: 'ok'
	})
)

router.use('/auth', auth)

router.use('/locations', location)

router.use('/itho', itho)

router.use('/smartdodos', smartdodos)

module.exports = router
