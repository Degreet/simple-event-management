async function request(url, method = 'GET', body, headers = {}) {
	if (body && typeof body === 'object') {
		body = JSON.stringify(body)
		headers['Content-Type'] = 'application/json'
	}

	const resp = await fetch(url, { method, body, headers })
	const data = await resp.json()
	return data
}
