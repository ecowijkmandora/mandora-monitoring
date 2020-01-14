const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')
const smartdodosController = require('../controllers/smartdodos.controller')
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
router
	.route('/import/:uuid')
	.post(
		jwt,
		authController.requestLogger,
		authController.adminAuthorizationRequired,
		upload.fields([{ name: 'energy' }]),
		smartdodosController.importCsv
	)

// Export energy data for address identified by uuid
router
	.route('/export/:uuid/energy')
	.get(jwt, authController.requestLogger, smartdodosController.exportEnergy)

module.exports = router
