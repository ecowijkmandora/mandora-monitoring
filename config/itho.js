module.exports = {
	measurements: {
		measurementPrefix: 'itho_',
		readings: {
			measurement: 'energy',
			units: 'kWh',
			delimiter: ';',
			source: 'csv',			
			columns: [
				'generated_timestamp',
				'generated',
				'consumed_timestamp',
				'consumed'
			],
			datasets: [
				['generated_timestamp', 'generated'],
				['consumed_timestamp', 'consumed']
			]
		},
		temperatures: {
			measurement: 'temperature',
			units: 'C',
			delimiter: ';',
			source: 'csv',
			columns: [
				'boiler_high_timestamp',
				'boiler_high',
				'boiler_low_timestamp',
				'boiler_low',
				'outdoor_timestamp',
				'outdoor',
				'indoor_timestamp',
				'indoor',
				'setting_timestamp',
				'setting'
			],
			datasets: [
				['boiler_high_timestamp', 'boiler_high'],
				['boiler_low_timestamp', 'boiler_low'],
				['outdoor_timestamp', 'outdoor'],
				['indoor_timestamp', 'indoor'],
				['setting_timestamp', 'setting']
			]
		}
	}
}
