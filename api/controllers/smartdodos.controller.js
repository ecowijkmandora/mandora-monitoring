require('module-alias/register')
const config = require('@config')
const logger = require('@lib/logger')
const smartdodos = require('@lib/smartdodos')
const _ = require('lodash')

exports.importCsv = (req, res, next) => {
	const files = req.files

	if (!files || files.length < 1) {
		res.status(500).json({
			error: 'No files uploaded.'
		})
		return
	}

	// TODO Check existance of location in MySQL
	const uuid = req.params.uuid

	const energy = files.energy

	if (energy) {
		_.forEach(energy, file => {
			const buffer = file.buffer
			smartdodos.csv.import.importCsvEnergy(uuid, buffer)
		})
	}

	res.status(200).json({
		message: 'Import started.'
	})
}

