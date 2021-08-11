const { Router } = require('express')
const authEventMiddleware = require('../middlewares/authEvent.middleware')
const getClicksCount = require('../core/getClicksCount')
const randomstring = require('randomstring')
const router = Router()

const { supportedActions, rules } = require('../global')

router.post('/action', authEventMiddleware, async (req, resp) => {
	const action = +req.body.action
	if (isNaN(action) || !supportedActions.includes(action)) return

	const { user } = req
	const { events } = user

	const id = randomstring.generate(32)
	events.push({ id, action, date: Date.now() })
	const clicks = getClicksCount(events)

	for (const rule of rules) {
		const check = rule(clicks)

		if (!check) {
			return resp.json({
				success: false,
				message: 'Нельзя добавить',
			})
		}
	}

	await user.save()

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
	user.events = user.events.filter((ev) => ev.id !== id)
	const clicks = getClicksCount(user.events)

	for (const rule of rules) {
		const check = rule(clicks)

		if (!check) {
			return resp.json({
				success: false,
				message: 'Нельзя изменить',
			})
		}
	}

	await user.save()

	return resp.json({
		success: true,
		events: user.events,
		clicks,
	})
})

module.exports = router
