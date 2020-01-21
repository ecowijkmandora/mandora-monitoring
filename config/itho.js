module.exports = {
	csv: {
		import: {
			measurementPrefix: 'itho_',
			source: 'csv',
			delimiter: ';',
			energy: {
				measurement: 'energy',
				units: 'kWh',
				columns: 4,				
				fields: [
					{
						0: 'timestamp',
						1: 'generated'
					},
					{
						2: 'timestamp',
						3: 'consumed'
					}
				]
			},
			temperature: {
				measurement: 'temperature',
				units: 'C',
				columns: 10,				
				fields: [
					{
						0: 'timestamp',
						1: 'boiler_high'
					},
					{
						2: 'timestamp',
						3: 'boiler_low'
					},
					{
						4: 'timestamp',
						5: 'outdoor'
					},
					{
						6: 'timestamp',
						7: 'indoor'
					},
					{
						8: 'timestamp',
						9: 'setting'
					}
				]
			}
		}
	}
}
