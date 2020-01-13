require('module-alias/register')
const config = require('@config')
const logger = require('@lib/logger')
const Location = require('@api/models/location.model')

exports.findAll = (req, res, next) => {
	Location.getAllMandated(req.auth.username, (err, data) => {
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
	const uuid = req.params.uuid

	Location.findByUuidMandated(req.auth.username, uuid, (err, data) => {
		if (err) {
			if (err.kind === 'not_found') {
				res.status(404).send({
					message: `Could not find location with uuid ${uuid}.`
				})
			}
			next()
		} else {
			res.send(data)
		}
	})
}
