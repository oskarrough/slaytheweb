import Dungeon, {graphToString} from '../../game/dungeon.js'
import {html, render, useState} from '../lib.js'
import {DungeonConfig} from './dungeon-config.js'
import {SlayMap} from './slay-map.js'

/** Preact component */
const MapDemo = () => {
	const [dungeon, setDungeon] = useState(Dungeon())
	const [scatter, setScatter] = useState(0)
	const [currentPos, setCurrentPos] = useState({x: 0, y: 0})
	const [debug, setDebug] = useState(true)

	window.slaymapdemo = dungeon

	const onSelect = (move) => {
		console.log('Selected move:', move)
		const node = dungeon.graph[move.y][move.x]
		const currentNode = dungeon.graph[currentPos.y][currentPos.x]

		// Only allow movement to connected nodes or start
		if (currentPos.y === 0 || currentNode.edges.includes(node.id)) {
			setCurrentPos(move)
			console.log('Moved to:', move, 'Paths still exist:', dungeon.paths.length)
		} else {
			console.log('Cannot move to unconnected node')
		}
	}

	const regenerateDungeon = (config) => {
		setDungeon(Dungeon(config))
		setCurrentPos({x: 0, y: 0})
	}

	return html`
		<div class="Box" style="max-width: 25rem">
			<details open>
				<summary><strong>Dungeon Configuration</strong></summary>
				<${DungeonConfig} onUpdate=${regenerateDungeon} debug=${debug} onDebugToggle=${() => setDebug(!debug)} />
				<fieldset class="Form">
					<label>
						Scatter: ${scatter}%
						<input
							type="range"
							min="0"
							max="20"
							value=${scatter}
							onInput=${(e) => setScatter(Number(e.target.value))}
						/>
					</label>
				</fieldset>
			</details>
			<pre>${graphToString(dungeon.graph)}</pre>
		</div>

		${
			dungeon &&
			html`
			<${SlayMap}
				dungeon=${dungeon}
				x=${currentPos.x}
				y=${currentPos.y}
				onSelect=${onSelect}
				scatter=${scatter}
				debug=${debug}
			><//>
		`
		}
	`
}

/** Custom element wrapping the MapDemo preact component */
class SlayMapDemo extends HTMLElement {
	connectedCallback() {
		render(html`<${MapDemo} />`, this)
	}
}

if (!customElements.get('slay-map-demo')) {
	customElements.define('slay-map-demo', SlayMapDemo)
}
