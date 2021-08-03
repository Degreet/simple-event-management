const mongoose = require('mongoose')

function connectMongoose(uri) {
	const connection = mongoose.connect(uri, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})

	mongoose.connection.on(
		'error',
		console.error.bind(console, 'connection error:')
	)

	return connection
}

module.exports = { connectMongoose }
