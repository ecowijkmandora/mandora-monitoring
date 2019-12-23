const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')
const controller = require('../controllers/itho.controller')

// Import Itho CSVs for address identified by uuid
router.post('/import/:uuid', jwt, controller.importCsv)

module.exports = router
