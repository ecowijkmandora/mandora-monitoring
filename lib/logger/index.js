// Initialize logger
const winston = require('winston')

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
				winston.format.printf(
					info =>
						`${info.timestamp} ${info.level} ${info.message} ${
							typeof info.obj !== 'undefined'
								? '\n' +
								  JSON.stringify(
										info.obj,
										(key, value) => {
											// Filtering out properties
											if (key.startsWith('password')) {
												return '********'
											}
											return value
										},
										4
								  )
								: ''
						}`
				)
			)
		})
	]
})

logger.debug('Logger has been initialized')

// Export the logger object
module.exports = logger
