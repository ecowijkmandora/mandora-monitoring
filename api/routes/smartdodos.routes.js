require('module-alias/register')
const Express = require('express')
const router = Express.Router()
const jwt = require('@api/jwt')
const smartdodosController = require('@api/controllers/smartdodos.controller')
const authController = require('@api/controllers/auth.controller')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router
	.route('/import/bulk/readings')
	.post(
		jwt,
		authController.requestLogger,
		authController.adminAuthorizationRequired,
		upload.any(),
		smartdodosController.bulkImportCsvReadings
	)

router
	.route('/import/bulk/usgaes')
	.post(
		jwt,
		authController.requestLogger,
		authController.adminAuthorizationRequired,
		upload.any(),
		smartdodosController.bulkImportCsvUsages
	)

router
	.route('/import/api/readings')
	.post(
		jwt,
		authController.requestLogger,
		authController.adminAuthorizationRequired,
		upload.any(),
		smartdodosController.apiReadings
	)

router
	.route('/import/api/usages')
	.post(
		jwt,
		authController.requestLogger,
		authController.adminAuthorizationRequired,
		upload.any(),
		smartdodosController.apiUsages
	)

router.post(
	'/import/:uuid',
	jwt,
	authController.requestLogger,
	authController.adminAuthorizationRequired,
	upload.fields([{ name: 'readings' }, { name: 'usages' }]),
	smartdodosController.importCsv
)

router.get(
	'/export/readings/:uuid',
	jwt,
	authController.requestLogger,
	smartdodosController.exportReadings
)

router.get(
	'/export/usages/:uuid',
	jwt,
	authController.requestLogger,
	smartdodosController.exportUsages
)

module.exports = router
