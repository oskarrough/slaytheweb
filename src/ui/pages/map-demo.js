import {html, render, useState, useEffect, useRef} from '../lib.js'
import {SlayMap} from '../components/map.js'
import Dungeon from '../../game/dungeon.js'

const useSyncStyle = (ref, styleKey, inputId, initialValue) => {
	useEffect(() => {
		const handleInputChange = (event) => {
			const value = styleKey.startsWith('--') ? event.target.value : `${event.target.value}px`
			console.log(styleKey, event.target.value, value)
			ref.current.base.style.setProperty(styleKey, value)
		}

		const input = document.getElementById(inputId)
		input.value = initialValue
		input.addEventListener('input', handleInputChange)

		return () => {
			input.removeEventListener('input', handleInputChange)
		}
	}, [ref, styleKey, inputId])
}

const DungeonConfigForm = (props) => {
	const [config, setConfig] = useState({
		width: 10,
		height: 6,
		minRooms: 2,
		maxRooms: 5,
		roomTypes: 'MMMCE',
		customPaths: '123',
	})

	const handleInput = (e, field) => {
		const newConfig = {...config}
		newConfig[field] = e.target.value
		setConfig(newConfig)
	}

	useEffect(() => {
		const dungeon = Dungeon(config)
		props.onUpdate(dungeon)
	}, [config])

	return html`
		<form>
			<label>
				Width
				<input type="number" value=${config.width} onInput=${(e) => handleInput(e, 'width')} />
			</label>
			<label>
				Height
				<input type="number" value=${config.height} onInput=${(e) => handleInput(e, 'height')} />
			</label>
			<label>
				Min Rooms
				<input type="number" value=${config.minRooms} onInput=${(e) => handleInput(e, 'minRooms')} />
			</label>
			<label>
				Max Rooms
				<input type="number" value=${config.maxRooms} onInput=${(e) => handleInput(e, 'maxRooms')} />
			</label>
			<label>
				Room Types
				<input type="text" value=${config.roomTypes} onInput=${(e) => handleInput(e, 'roomTypes')} />
			</label>
			<label>
				Custom Paths
				<input type="text" value=${config.customPaths} onInput=${(e) => handleInput(e, 'customPaths')} />
			</label>
		</form>
	`
}

const Demo = () => {
	const ref = useRef(null)
	const [dungeon, setDungeon] = useState(Dungeon())

	// useSyncStyle(ref, '--highlight', 'highlightColor', 'gold')
	// useSyncStyle(ref, '--pathColor', 'pathColor', 'black')
	// useSyncStyle(ref, 'width', 'width', '500')
	// useSyncStyle(ref, 'min-height', 'minHeight', 'none')

	const x = 0
	const y = 0
	const onSelect = (move) => {
		console.log('move', move)
	}

	return html`
		<div class="Box">
			<form hidden>
				<fieldset>
					<legend>Dungeon settings</legend>
				</fieldset>
				<fieldset>
					<legend>Styles</legend>
					<label>Highlight color <input type="color" id="highlightColor" value="gold" /></label>
					<label>Path color <input type="color" id="pathColor" value="black" /></label>
					<!-- <label>Width <input type="number" id="width" step="20" value="500" /></label> -->
					<!-- <label>Height <input type="number" id="minHeight" step="100" value="0" /></label> -->
				</fieldset>
			</form>

			<${DungeonConfigForm} onUpdate=${(x) => setDungeon(x)} />
		</div>

		<${SlayMap}
			ref=${ref}
			dungeon=${dungeon}
			x=${x}
			y=${y}
			onSelect=${onSelect}
			disableScatter=${true}
			debug=${false}
		><//>
	`
}

render(html`<${Demo} />`, document.querySelector('#root'))
