import {html, render, useState} from '../lib.js'
import {SlayMap} from '../components/map.js'
import Dungeon, {defaultOptions as defaultDungeonOptions} from '../../game/dungeon.js'

const Demo = () => {
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
				<${DungeonConfigForm} onUpdate=${(config) => setDungeon(Dungeon(config))} />
			</details>
		</div>

		${dungeon &&
		html` <${SlayMap} dungeon=${dungeon} x=${x} y=${y}
			onSelect=${onSelect}
			scatter=${scatter}
			debug=${true}><//>
		`}
	`
}

const DungeonConfigForm = (props) => {
	const [config, setConfig] = useState(defaultDungeonOptions)
	const [styles, setStyles] = useState(defaultDungeonOptions)

	const handleInput = (e, field) => {
		console.log('requested dungeon config update:', field)
		const newConfig = {...config}
		newConfig[field] = e.target.type === 'number' ? Number(e.target.value) : e.target.value
		setConfig(newConfig)
		props.onUpdate(newConfig)
	}

	const handleStyleInput = (e, field) => {
		console.log('requested style update', field)
		const el = document.querySelector('slay-map')
		const {value} = e.target
		// el.style.setProperty(`--${field}`, value)
		if (field === 'min-height') {
			el.style[field] = value + 'vh'
		} else {
			el.style[field] = value
		}
	}

	const toggleDebugStyles = (e) => {
		const el = document.querySelector('slay-map')
		el.classList.toggle('debug')
	}

	return html`
		<form class="Form">
			<fieldset>
				<legend>Dungeon size</legend>
				<label>
					Floors
					<input type="number" value=${config.height} min="0" onInput=${(e) => handleInput(e, 'height')} />
				</label>
				<label>
					Columns
					<input type="number" value=${config.width} onInput=${(e) => handleInput(e, 'width')} />
				</label>
			</fieldset>
			<fieldset>
				<legend>Map size</legend>
				<label>Debug styles <input type="checkbox" onInput=${e => toggleDebugStyles()} /></label>
				<label>
					Height
					<input type="number" value="70" min="0" step="5" onInput=${(e) => handleStyleInput(e, 'min-height')} />vh
				</label>
				<label hidden>
					Width
					<input type="number" value=${styles.width} onInput=${(e) => handleStyleInput(e, 'width')} />
				</label>
			</fieldset>
			<fieldset>
				<legend>Amout of rooms per floor</legend>
				<label>
					Min
					<input type="number" value=${config.minRooms} onInput=${(e) => handleInput(e, 'minRooms')} />
				</label>
				<label>
					Max
					<input type="number" value=${config.maxRooms} onInput=${(e) => handleInput(e, 'maxRooms')} />
				</label>
			</fieldset>
			<fieldset>
				<legend>Custom rooms & paths</legend>
				<label>
					Room Types
					<input type="text" value=${config.roomTypes} onInput=${(e) => handleInput(e, 'roomTypes')} />
				</label>
				<p>
					M for monster, E for elite, C for camp. Repeat character to increase chance of appearing. There is additional
					logic in the code as well, which for example increases chance of elites on higher floors.
				</p>
				<label>
					Paths to draw
					<input
						type="text"
						value=${config.customPaths}
						onInput=${(e) => handleInput(e, 'customPaths')}
						placeholder="0235"
					/>
				</label>
				<p>
					Defaults to draw one path per column. To draw paths on specific columns enter a string of indexes like
					<code>034</code>. This would attempt to draw three paths at those indexes.
				</p>
			</fieldset>
		</form>
	`
}

render(html`<${Demo} />`, document.querySelector('#root'))
