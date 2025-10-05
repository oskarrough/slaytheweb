import {defaultOptions as defaultDungeonOptions} from '../../game/dungeon.js'
import {html, useState} from '../lib.js'

export const DungeonConfig = (props) => {
	const [config, setConfig] = useState(defaultDungeonOptions)
	const [styles] = useState(defaultDungeonOptions)

	const handleInput = (e, field) => {
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
			el.style[field] = `${value}vh`
		} else {
			el.style[field] = value
		}
	}

	const [debugStyles, setDebugStyles] = useState(true)

	const toggleDebugStyles = () => {
		const el = document.querySelector('slay-map')
		el.classList.toggle('debug')
		setDebugStyles(!debugStyles)
	}

	return html`
		<form class="Form FForm--vertical">
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
				<label>Debug styles <input type="checkbox" checked=${debugStyles} onInput=${() => toggleDebugStyles()} /></label>
				<label>
					Height in vh
					<input
						type="number"
						value="70"
						min="0"
						step="5"
						onInput=${(e) => handleStyleInput(e, 'min-height')}
					/>
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
					M for monster, E for elite, C for camp. Repeat character to increase chance of appearing. There is
					additional logic in the code as well, which for example increases chance of elites on higher floors.
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
					Defaults to draw one path per column. To draw paths on specific columns enter a string of indexes
					like
					<code>034</code>. This would attempt to draw three paths at those indexes.
				</p>
			</fieldset>
		</form>
	`
}
