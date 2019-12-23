const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')
const controller = require('../controllers/itho.controller')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Import Itho CSVs for address identified by uuid
router.post('/import/:uuid', jwt, upload.fields([
	{ name: 'energy', maxCount: 1 },
	{ name: 'temperature', maxCount: 1 }
]),controller.importCsv)

module.exports = router
