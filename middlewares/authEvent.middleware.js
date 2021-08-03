const Events = require('../models/Events')
const { Types } = require('mongoose')

const hourInMs = 2.77778e-7

module.exports = async function authEventMiddleware(req, resp, next) {
	const fail = async () => {
		const event = new Events()
		await event.save()

		const { _id } = event
		if (!_id) return

		req.cookies.set('event_id', _id.toString())
		req.event = event
		return next()
	}

	try {
		const eventId = req.cookies.get('event_id')
		if (!eventId) return fail()

		const _id = Types.ObjectId(eventId)
		const event = await Events.findOne({ _id })
		if (!event) return

		req.event = event
		return next()
	} catch {
		return fail()
	}
}
