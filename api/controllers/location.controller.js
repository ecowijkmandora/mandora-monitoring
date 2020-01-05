require('module-alias/register')
const config = require('@config')
const logger = require('@lib/logger')
const Location = require('@api/models/location.model')

exports.findAll = (req, res, next) => {
	// TODO Respect authorization levels (address data)
	Location.getAll((err, data) => {
		if (err) {
			if (err.kind === 'not_found') {
				res.status(404).send({
					message: `Could not find locations.`
				})
			}
			next()
		} else {
			const locations = Array.from(data)
			res.send(locations)
		}
	})
}

exports.findByUuid = (req, res, next) => {
	// TODO Respect authorization levels (address data)
	const uuid = req.params.uuid

	Location.findByUuid(uuid, (err, data) => {
		if (err) {
			if (err.kind === 'not_found') {
				res.status(404).send({
					message: `Could not find location with uuid "${uuid}".`
				})
			}
			next()
		} else {
			//const locations = Array.from(data)
			//logger.debug('Retrieved all locations:', locations)
			res.send(data)
		}
	})
}
