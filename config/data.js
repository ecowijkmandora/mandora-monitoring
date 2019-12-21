module.exports = {
	influx: {
		host: process.env.INFLUX_HOST || 'localhost',
		port: process.env.INFLUX_PORT || 8086,
		protocol : process.env.INFLUX_PROTOCOL || 'http',		
		database: process.env.INFLUX_DATABASE || 'mandora',
		username: process.env.INFLUX_USERNAME || 'mandora',
		password: process.env.INFLUX_PASSWORD || 'mandora'
	},
	mysql: {	
		host: process.env.MYSQL_HOST || 'localhost',
		database: process.env.MYSQL_DATABASE || 'mandora',		
		username: process.env.MYSQL_USERNAME || 'mandora',
		password: process.env.MYSQL_PASSWORD || 'mandora',
		aesSecret: process.env.MYSQL_AES_KEY
	}
}
