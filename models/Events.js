const mongoose = require('mongoose')

const model = mongoose.Schema({
	events: { type: Array, default: [] },
	dateCreate: { type: Date, default: Date.now },
})

module.exports = mongoose.model('events', model)
