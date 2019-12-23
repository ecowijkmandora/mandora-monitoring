require('module-alias/register')
const config = require('@config')
const logger = require('@lib/logger')
const itho = require('@lib/itho')

exports.importCsv = (req, res, next) => {
	const uuid = req.params.uuid

	// Check existance of location

	// Check request body, does it contain a csv?

	// Import energy values to InfluxDB
    //itho.csv.import.importCsvEnergyInstallation('3991MA2',__dirname + '/data/itho/20190830/dashboard_energy_3991MA2.csv')
	//itho.csv.import.importCsvTemperatureEnv('3991MA2',__dirname + '/data/itho/20190830/wpu_temps_3991MA2.csv')
    //itho.csv.import.importCsvTemperatureBoiler('3991MA2',__dirname + '/data/itho/20190830/wpu_temps_3991MA2.csv')
    
	res.status(404).json({
		message: 'not implemented'
	})
}
