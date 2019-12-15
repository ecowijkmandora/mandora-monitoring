module.exports = {
	csv: {
		import: {
			measurementPrefix: 'itho_',
			source: 'csv',
			importPath: 'import/itho',
			processedPath: 'import/itho/processed',
			errorPath: 'import/itho/error',
			delimiter: ';',
			energy_installation: {
				measurement: 'energy_installation',
				units: 'kWh',
				fields: {
					// Date Time;Total generated energy by the installation after completion;Date Time;Total consumed energy by the installation after completion
					0: 'timestamp',
					1: 'generated',
					3: 'consumed'
				}
			},
			temperature_env: {
				// Date Time;T high;Date Time;T low;Date Time;T outdoor;Date Time;T indoor;Date Time;T set
				measurement: 'temperature_env',
				units: 'C',
				fields: {
					0: 'timestamp',
					5: 'outdoor',
					7: 'indoor',
					9: 'setting'
				}
			},
			temperature_boiler: {
				// Date Time;T high;Date Time;T low;Date Time;T outdoor;Date Time;T indoor;Date Time;T set
				measurement: 'temperature_boiler',
				units: 'C',
				fields: {
					0: 'timestamp',
					1: 'high',
					3: 'low'
				}
			}
		}
	}
}
