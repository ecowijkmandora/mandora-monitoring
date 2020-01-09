const Express = require('express')
const router = Express.Router()
const jwt = require('../jwt')
const controller = require('../controllers/smartdodos.controller')

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Bulk import Itho energy CSVs for address identified by uuid found in field names of the form
router.post('/import/bulk/energy', jwt, upload.any(),controller.bulkImportCsvEnergy)

// Bulk import Itho energy CSVs for specific EANs/months using SmartDodos API calls
router.post('/import/api/readings', jwt, upload.any(),controller.apiReadings)

// Import SmartDodos CSVs for address identified by uuid
router.post('/import/:uuid', jwt, upload.fields([
	{ name: 'energy' }
]),controller.importCsv)

// Export energy data for address identified by uuid
router.get('/export/:uuid/energy', jwt,controller.exportEnergy)

module.exports = router
