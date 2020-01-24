require('module-alias/register')
const Express = require('express')
const router = Express.Router()
const jwt = require('@api/jwt')
const ithoController = require('@api/controllers/itho.controller')
const authController = require('@api/controllers/auth.controller')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Bulk import Itho energy CSVs for address identified by uuid found in field names of the form
router
	.route('/import/bulk/readings')
	.post(
		jwt,
		authController.requestLogger,
		authController.adminAuthorizationRequired,
		upload.any(),
		ithoController.bulkImportCsvReadings
	)

// Bulk import Itho energy CSVs for address identified by uuid found in field names of the form
router
	.route('/import/bulk/temperatures')
	.post(
		jwt,
		authController.requestLogger,
		authController.adminAuthorizationRequired,
		upload.any(),
		ithoController.bulkImportCsvTemperatures
	)

// Import Itho CSVs for address identified by uuid
router.post(
	'/import/:uuid',
	jwt,
	authController.requestLogger,
	authController.adminAuthorizationRequired,
	upload.fields([{ name: 'readings' }, { name: 'temperatures' }]),
	ithoController.importCsv
)

// Export energy data for address identified by uuid
router.get(
	'/export/readings/:uuid',
	jwt,
	authController.requestLogger,
	ithoController.exportReadings
)

// Export temperature data for address identified by uuid
router.get(
	'/export/temperatures/:uuid',
	jwt,
	authController.requestLogger,
	ithoController.exportTemperatures
)

module.exports = router
