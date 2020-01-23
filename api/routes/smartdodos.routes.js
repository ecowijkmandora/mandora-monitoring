const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')
const smartdodosController = require('@api/controllers/smartdodos.controller')
const authController = require('@api/controllers/auth.controller')

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
		smartdodosController.bulkImportCsvEnergy
	)

// Bulk import Itho energy CSVs for specific EANs/months using SmartDodos API calls
router
	.route('/import/api/readings')
	.post(
		jwt,
		authController.requestLogger,
		authController.adminAuthorizationRequired,
		upload.any(),
		smartdodosController.apiReadings
	)

// Import SmartDodos CSVs for address identified by uuid
router.post(
	'/import/:uuid',
	jwt,
	authController.requestLogger,
	authController.adminAuthorizationRequired,
	upload.fields([{ name: 'energy' }, { name: 'usage'}]),
	smartdodosController.importCsv
)

// Export energy data for address identified by uuid
router.get(
	'/export/energy/:uuid',
	jwt,
	authController.requestLogger,
	smartdodosController.exportEnergy
)

// Export energy data for address identified by uuid
router.get(
	'/export/usage/:uuid',
	jwt,
	authController.requestLogger,
	smartdodosController.exportUsage
)

module.exports = router
