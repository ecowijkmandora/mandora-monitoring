/**
 * Mandora Monitoring
 */
require('dotenv').config()
require('module-alias/register')

// Initialize logger
const logger = require('@lib/logger')

// Initialize Itho services
require('@lib/itho')

// Initialize SmartDodos services
require('@lib/smartdodos')

// Initialize data store
const { store } = require('@lib/data')

// Initialize Mandora API services
const { server } = require('@api')

store.events.on('ready', () => {
	server.start()
})

store.events.on('error', err => {
	logger.error('Error occured in data store, exiting', err)
	process.exit(1)
})
