import {html} from '../../web_modules/htm/preact/standalone.module.js'

export default function map({dungeon}) {
	return html`
		<h2>Map of the dungeon</h2>
		<ul class="MapList">
			${dungeon.rooms.map(
				(room, index) =>
					html`<li>Room ${index} ${index === dungeon.index ? '(you are here)' : ''}</li>`
			)}
		</ul>
	`
}
