const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')
const controller = require('../controllers/smartdodos.controller')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Import SmartDodos CSVs for address identified by uuid
router.post('/import/:uuid', jwt, upload.fields([
	{ name: 'energy' }
]),controller.importCsv)

module.exports = router
