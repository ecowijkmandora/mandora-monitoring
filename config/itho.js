module.exports = {
	csv: {
		import: {
			measurementPrefix: 'itho_',
			source: 'csv',
			delimiter: ';',
			energy: {
				measurement: 'energy',
				units: 'kWh',
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
			temperature: {
				measurement: 'temperature',
				units: 'C',
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
}
