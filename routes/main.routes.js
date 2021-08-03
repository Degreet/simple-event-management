const { Router } = require('express')
const authEventMiddleware = require('../middlewares/authEvent.middleware')
const getClicksCount = require('../core/getClicksCount')
const router = Router()

router.get('/', authEventMiddleware, (req, resp) => {
	const events = req.event.events
	const clicks = getClicksCount(events)

	resp.render('index', {
		clicks,
		events,
	})
})

module.exports = router
