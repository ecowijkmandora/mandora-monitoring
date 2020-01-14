const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')
const ithoController = require('../controllers/itho.controller')
const authController = require('../controllers/auth.controller')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Bulk import Itho energy CSVs for address identified by uuid found in field names of the form
router
	.route('/import/bulk/energy')
	.post(
		jwt,
		authController.requestLogger,
		authController.adminAuthorizationRequired,
		upload.any(),
		ithoController.bulkImportCsvEnergy
	)

// Bulk import Itho energy CSVs for address identified by uuid found in field names of the form
router
	.route('/import/bulk/temperature')
	.post(
		jwt,
		authController.requestLogger,
		authController.adminAuthorizationRequired,
		upload.any(),
		ithoController.bulkImportCsvTemperature
	)

// Import Itho CSVs for address identified by uuid
router.post(
	'/import/:uuid',
	jwt,
	authController.requestLogger,
	authController.adminAuthorizationRequired,
	upload.fields([{ name: 'energy' }, { name: 'temperature' }]),
	ithoController.importCsv
)

// Export energy data for address identified by uuid
router.get(
	'/export/:uuid/energy',
	jwt,
	authController.requestLogger,
	ithoController.exportEnergy
)

// Export temperature data for address identified by uuid
router.get(
	'/export/:uuid/temperature',
	jwt,
	authController.requestLogger,
	ithoController.exportTemperature
)

module.exports = router
