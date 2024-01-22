import Dungeon from '../../game/dungeon.js'
import {html, render, useState} from '../lib.js'
import {SlayMap} from './slay-map.js'
import {DungeonConfig} from './dungeon-config.js'

const MapDemo = () => {
	const [dungeon, setDungeon] = useState(Dungeon())
	const [scatter, setScatter] = useState(0)
	const x = 0
	const y = 0
	const onSelect = (move) => {
		console.log('move', move)
	}

	return html`
		<div class="Box">
			<details>
				<summary>Options</summary>
				<${DungeonConfig} onUpdate=${(config) => setDungeon(Dungeon(config))} />
			</details>
		</div>

		${dungeon &&
		html`
			<${SlayMap} dungeon=${dungeon} x=${x} y=${y} onSelect=${onSelect} scatter=${scatter} debug=${true}><//>
		`}
	`
}

class SlayMapDemo extends HTMLElement {
	connectedCallback() {
		render(html`<${MapDemo} />`, this)
	}
}

if (!customElements.get('slay-map-demo')) {
	customElements.define('slay-map-demo', SlayMapDemo)
}
