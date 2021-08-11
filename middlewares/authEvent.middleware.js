const User = require('../models/User')
const { Types } = require('mongoose')

module.exports = async function authEventMiddleware(req, _, next) {
	const fail = async () => {
		const user = new User()
		await user.save()

		const { _id } = user
		if (!_id) return

		req.cookies.set('user_id', _id.toString())
		req.user = user
		return next()
	}

	try {
		const userId = req.cookies.get('user_id')
		if (!userId) return fail()

		const _id = Types.ObjectId(userId)
		const user = await User.findOne({ _id })
		if (!user) return

		req.user = user
		return next()
	} catch {
		return fail()
	}
}
