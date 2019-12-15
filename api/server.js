require('module-alias/register')
const config = require('@config')
const logger = require('@lib/logger')

const Express = require('express')
const BodyParser = require('body-parser')
const routes = require('./routes')

const API_SERVER_PORT = config.api.server.port

const app = Express()

app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))

// Mount all routes on /api path
app.use('/api', routes)

// Error handler
app.use((err, req, res, next) => {
	res.status(500).json({
		status: err.status,
		message: err.message
	})
})

const start = () => {
	app.listen(API_SERVER_PORT, () => {
		logger.info(`Mandora API server started on :${API_SERVER_PORT}`)
	})
}

module.exports = {
	start: start
}
