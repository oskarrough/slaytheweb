import {html, useState} from '../lib.js'
import {postRun} from '../../game/backend.js'

/**
 * Renders a form to submit the game run to the backend.
 * @param {object} props
 * @param {import('../../game/new-game.js').Game} props.game
 * @returns {import('preact').VNode}
 */
export function PublishRun({game}) {
	const [loading, setLoading] = useState(false)
	const [didSubmit, setDidSubmit] = useState(false)

	async function onSubmit(event) {
		event.preventDefault()
		setLoading(true)
		const fd = new FormData(event.target)
		const name = String(fd.get('playername'))
		await postRun(game, name)
		setLoading(false)
		setDidSubmit(true)
	}

	const endedAt = game.state.endedAt || new Date().getTime()
	const duration = (endedAt - game.state.createdAt) / 1000

	return html`
		<form onSubmit=${onSubmit} class="Form Form--vertical">
			<p>You reached floor ${game.state.dungeon.y} in ${duration} seconds.</p>
			${!didSubmit
				? html`
						<label
							>Want to post your run to the public, Slay the Web highscores?<br />
							<input type="text" name="playername" maxlength="140" required placeholder="Know thyself" />
						</label>
						<button disabled=${loading} type="submit">Submit my run</button>
						<p>${loading ? 'Submitting…' : ''}</p>
						<p center><a href="/stats">View highscores</a></p>
					`
				: html`<p>Thank you.</p>`}
		</form>
	`
}
