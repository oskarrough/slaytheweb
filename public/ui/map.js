import {html} from '../../web_modules/htm/preact/standalone.module.js'

export default function map({dungeon}) {
	return html`
		<ol>
			${dungeon.rooms.map(
				(room, index) => html`<li>Room ${index} ${index === dungeon.index ? '(X)' : ''}</li>`
			)}
		</ol>
	`
}
