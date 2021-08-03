const getClicksCount = (events) =>
	events.reduce((acc, event) => acc + event.action, 0)

module.exports = getClicksCount
