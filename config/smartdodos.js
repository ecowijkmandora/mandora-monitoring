module.exports = {
	api: {
		app: {
			baseUrl: 'https://app-api.smartdodos.com/api/p4',
			readingService: '/getreadings',
			parameterAccessToken: 'access_token',
			parameterEan: 'ean',
			parameterMonth: 'month'
		},
		auth: {
			baseUrl: 'https://auth-api.smartdodos.com',
			tokenService: '/token'
		},
		umeter: {
			baseUrl: 'https://p42.umeter.nl/api',
			usageService: '/usagefile' // append to route: /:ean/:month
		}
	},
	measurements: {
		measurementPrefix: 'smartdodos_',
		readings: {
			measurement: 'reading',
			units: 'Wh',
			delimiter: ',',
			source: 'csv',			
			columns: ['timestamp', 'consumed', 'generated'],
			datasets: [['timestamp', 'consumed', 'generated']]
		},
		usages: {
			measurement: 'usage',
			units: 'W',
			delimiter: ';',
			source: 'csv',			
			columns: [
				'timestamp_from', // from
				'timestamp', // to
				'consumed',
				'generated'
			],
			datasets: [['timestamp', 'consumed', 'generated']]
		}
	}
}
