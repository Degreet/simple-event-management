const { Router } = require('express')
const authEventMiddleware = require('../middlewares/authEvent.middleware')
const getClicksCount = require('../core/getClicksCount')
const randomstring = require('randomstring')
const router = Router()

const supportActions = [1, -1]

router.post('/action', authEventMiddleware, async (req, resp) => {
	const action = +req.body.action
	if (isNaN(action) || !supportActions.includes(action)) return

	const { event } = req
	const { events } = event

	const id = randomstring.generate(32)
	events.push({ id, action, date: Date.now() })
	await event.save()

	const clicks = getClicksCount(events)

	return resp.json({
		success: true,
		clicks,
		events,
	})
})

router.post('/cancel', authEventMiddleware, async (req, resp) => {
	const { id } = req.body
	if (!id) return

	const { event } = req
	event.events = event.events.filter((ev) => ev.id !== id)
	await event.save()

	const clicks = getClicksCount(event.events)

	return resp.json({
		success: true,
		events: event.events,
		clicks,
	})
})

module.exports = router
