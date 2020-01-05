module.exports = {
	csv: {
		import: {
			measurementPrefix: 'itho_',
			source: 'csv',
			importPath: 'import/itho',
			processedPath: 'import/itho/processed',
			errorPath: 'import/itho/error',
			delimiter: ';',
			energy: {
				measurement: 'energy',
				units: 'kWh',
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
