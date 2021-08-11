const { Router } = require('express')
const authEventMiddleware = require('../middlewares/authEvent.middleware')
const getClicksCount = require('../core/getClicksCount')
const randomstring = require('randomstring')
const router = Router()

const supportActions = [1, -1]

router.post('/action', authEventMiddleware, async (req, resp) => {
	const action = +req.body.action
	if (isNaN(action) || !supportActions.includes(action)) return

	const { user } = req
	const { events } = user

	const id = randomstring.generate(32)
	events.push({ id, action, date: Date.now() })
	await user.save()

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

	const { user } = req
	const eventForCancel = user.events.find((ev) => ev.id === id)
	const eventAction = eventForCancel.action
	let clicks = getClicksCount(user.events)

	if (eventAction === 1 && clicks - eventAction < 0) {
		return resp.status(418).json({
			success: false,
			message: 'Нельзя отменить',
		})
	}

	user.events = user.events.filter((ev) => ev.id !== id)
	clicks = getClicksCount(user.events)
	await user.save()

	return resp.json({
		success: true,
		events: user.events,
		clicks,
	})
})

module.exports = router
