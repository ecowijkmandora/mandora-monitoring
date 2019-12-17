require('module-alias/register')
const config = require('@config')
const mysql = require('mysql')
const logger = require('@lib/logger')
const EventEmitter = require('events')

class MysqlEmitter extends EventEmitter {}
const mysqlEmitter = new MysqlEmitter()

const MYSQL_DATABASE = config.data.mysql.database
const MYSQL_HOST = config.data.mysql.host
const MYSQL_USERNAME = config.data.mysql.username
const MYSQL_PASSWORD = config.data.mysql.password

const options = {
	host: MYSQL_HOST,
	user: MYSQL_USERNAME,
	password: MYSQL_PASSWORD,
	database: MYSQL_DATABASE
}

const connection = mysql.createConnection(options)

connection.connect(function(err) {
	if (!err) {
		logger.info('Initialized MySQL')
		mysqlEmitter.emit('connected')
	} else {
		logger.error(`Error initializing MySQL database!`, err)
		mysqlEmitter.emit('error', err)
	}
})

// Export the InfluxDB object
module.exports = {
	connection: connection,
	events: mysqlEmitter
}
