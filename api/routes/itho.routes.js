const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')
const controller = require('../controllers/itho.controller')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Bulk import Itho energy CSVs for address identified by uuid found in field names of the form
router.post(
	'/import/bulk/energy',
	jwt,
	upload.any(),
	controller.bulkImportCsvEnergy
)

// Bulk import Itho energy CSVs for address identified by uuid found in field names of the form
router.post(
	'/import/bulk/temperature',
	jwt,
	upload.any(),
	controller.bulkImportCsvTemperature
)

// Import Itho CSVs for address identified by uuid
router.post(
	'/import/:uuid',
	jwt,
	upload.fields([{ name: 'energy' }, { name: 'temperature' }]),
	controller.importCsv
)

// Export energy data for address identified by uuid
router.get('/export/:uuid/energy', jwt, controller.exportEnergy)

// Export temperature data for address identified by uuid
router.get('/export/:uuid/temperature', jwt, controller.exportTemperature)

module.exports = router
