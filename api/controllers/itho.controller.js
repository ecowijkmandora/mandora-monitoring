require('module-alias/register')
const config = require('@config')
const logger = require('@lib/logger')
const itho = require('@lib/itho')
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
	const temperature = files.temperature

	if (energy) {
		_.forEach(energy, file => {
			const buffer = file.buffer
			itho.csv.import.importCsvEnergy(uuid, buffer)
		})
	}

	if (temperature) {
		_.forEach(temperature, file => {
			const buffer = file.buffer
			itho.csv.import.importCsvTemperature(uuid, buffer)
		})
	}

	res.status(200).json({
		message: 'Import started.'
	})
}

exports.bulkImportCsvEnergy = (req, res, next) => {
	const files = req.files

	if (!files || files.length < 1) {
		res.status(500).json({
			error: 'No files uploaded.'
		})
	}

	for (let file of files) {
		const uuid = file.fieldname
		// TODO Check existance of location in MySQL
		const buffer = file.buffer
		itho.csv.import.importCsvEnergy(uuid, buffer)
	}

	res.status(200).json({
		message: 'Import started.'
	})
}

exports.bulkImportCsvTemperature = (req, res, next) => {
	const files = req.files

	if (!files || files.length < 1) {
		res.status(500).json({
			error: 'No files uploaded.'
		})
	}

	for (let file of files) {
		const uuid = file.fieldname
		// TODO Check existance of location in MySQL
		const buffer = file.buffer
		itho.csv.import.importCsvTemperature(uuid, buffer)
	}

	res.status(200).json({
		message: 'Import started.'
	})
}
