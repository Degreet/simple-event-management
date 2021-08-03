const express = require('express')
const { connectMongoose } = require('./core/db')
const useCookies = require('./core/useCookies')
require('dotenv').config()

const port = process.env.PORT
const app = express()

app.use(useCookies)
app.use(express.json())
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.listen(port, async () => {
	const uri = process.env.MONGO_URI
	await connectMongoose(uri)

	app.use('/', require('./routes/main.routes'))
	app.use('/api/clicks', require('./routes/clicks.routes'))

	console.log('Started')
})
