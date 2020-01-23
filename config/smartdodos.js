module.exports = {
	api: { 
		baseUrl: 'https://app-api.smartdodos.com/api/p4',		
		energyService: '/getreadings',
		parameterAccessToken: 'access_token',
		parameterEan: 'ean',
		parameterMonth: 'month'
	},
	auth: {
		baseUrl: 'https://auth-api.smartdodos.com',
		tokenService: '/token'
	},
	csv: {
		import: {
			measurementPrefix: 'smartdodos_',
			source: 'csv',			
			energy: {
				measurement: 'energy',
				units: 'Wh',
				delimiter: ',',
				columns: [
					'timestamp',
					'consumed',
					'generated'
				],
				datasets: [
					['timestamp', 'consumed', 'generated']
				]
			},
			usage: {
				measurement: 'usage',
				units: 'W',
				delimiter: ';',
				columns: [
					'timestamp_from', // from 
					'timestamp', // to
					'consumed',
					'generated'
				],
				datasets: [
					['timestamp', 'consumed', 'generated']
				]
			}
		}
	}
}
