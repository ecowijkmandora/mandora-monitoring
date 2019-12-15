// Initialize logger
const winston = require('winston')

const logger = winston.createLogger({
	level: 'info',
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			)
		})
	]
})

logger.debug('Logger has been initialized')

// Export the logger object
module.exports = logger
