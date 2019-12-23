require('module-alias/register')
const config = require('@config')
const logger = require('@lib/logger')
const itho = require('@lib/itho')

exports.importCsv = (req, res, next) => {
	// TODO Check existance of location in MySQL
	const uuid = req.params.uuid

	const energy = req.files.energy
	const temperature = req.files.temperature

	if (!energy && !temperature) {
		res.status(500).json({
			message: 'no files uploaded'
		})	
	} 

	if (energy) {
		const buffer = energy[0].buffer
		itho.csv.import.importCsvEnergyInstallation(uuid,buffer)
	}

	if (temperature) {
		const buffer = temperature[0].buffer
		itho.csv.import.importCsvTemperatureEnv(uuid,buffer)
		itho.csv.import.importCsvTemperatureBoiler(uuid,buffer)
	}	

	res.status(200).json({
		message: 'Import started.'
	})
}
