import {html} from '../../web_modules/htm/preact/standalone.module.js'

export default function map({dungeon}) {
	function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1)
	}
	return html`
		<h2>Map of the dungeon</h2>
		<ul class="MapList">
			${dungeon.rooms.map(
				(room, index) =>
					html`<li>
						${index}. ${capitalize(room.type)} ${index === dungeon.index ? '(you are here)' : ''}
					</li>`
			)}
		</ul>
	`
}
