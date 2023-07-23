import {html, useState} from './lib.js'
import {postRun} from '../game/backend.js'

/**
 * Renders a form to submit the game run to the backend.
 * @param {object} props
 * @param {import('../game/new-game.js').Game} props.game
 * @returns {import('preact').VNode}
 */
export function PublishRun({game}) {
	const [loading, setLoading] = useState(false)

	async function onSubmit(event) {
		event.preventDefault()
		setLoading(true)
		const fd = new FormData(event.target)
		const name = String(fd.get('playername'))
		await postRun(game, name)
		setLoading(false)
	}

	const duration = (game.state.endedAt - game.state.createdAt) / 1000

	return html`
		<form onSubmit=${onSubmit}>
			<p>You reached floor ${game.state.turn} in ${duration} seconds.</p>
			<label
				>What are you? <input type="text" name="playername" required placeholder="Know thyself"
			/></label>
			<button disabled=${loading} type="submit">Submit my run</button>
			<p>${loading ? 'submitting' : ''}</p>
		</form>
	`
}
