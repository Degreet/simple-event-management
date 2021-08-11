const plusBtn = document.getElementById('plus-btn')
const minusBtn = document.getElementById('minus-btn')

const eventsListEl = document.getElementById('events-list')
const clicksCounterEl = document.getElementById('clicks-counter')

function turnBtns(isOn) {
	return [plusBtn, minusBtn].forEach((btn) => (btn.disabled = !isOn))
}

function render() {
	clicksCounterEl.innerText = clicks.toString()
	eventsListEl.innerHTML = ''

	events.forEach((event) => {
		eventsListEl.innerHTML += /* html */ `
			<li data-id="${event.id}">
				<span>${new Date(event.date).toLocaleString()}</span>
				<span>${event.action}</span>
				<button data-id="${event.id}">Cancel</button>
			</li>
		`
	})

	document.querySelectorAll('#events-list li button').forEach((btn) => {
		btn.addEventListener('click', (e) => {
			const { id } = e.target.dataset
			cancelAction(id)
		})
	})
}

async function cancelAction(id) {
	// turn off btns
	turnBtns(false)

	const data = await request('/api/clicks/cancel', 'POST', { id })

	if (!data || !data.success) {
		alert(data.message || 'Ошибка')
	} else {
		clicks = data.clicks
		events = data.events
		render()
	}

	// turn on button
	turnBtns(true)
}

async function goAction(action) {
	// turn off btns
	turnBtns(false)

	const data = await request('/api/clicks/action', 'POST', { action })
	if (!data || !data.success) return

	clicks = data.clicks
	events = data.events
	render()

	// turn on button
	turnBtns(true)
}

plusBtn.addEventListener('click', goAction.bind(null, 1))
minusBtn.addEventListener('click', goAction.bind(null, -1))

events = JSON.parse(events)
render()
