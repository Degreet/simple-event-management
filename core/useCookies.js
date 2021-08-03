const Cookies = require('cookies')

module.exports = function useCookies(req, resp, next) {
	const cookies = new Cookies(req, resp)
	req.cookies = cookies
	return next()
}
