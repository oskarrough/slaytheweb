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

const Demo = () => {
	const ref = useRef(null)

	const [dungeonConfig, setDungeonConfig] = useState({
		width: 10,
		height: 6,
		minRooms: 2,
		maxRooms: 5,
		roomTypes: 'MMMCE',
		customPaths: '123',
	})

	const [dungeon, setDungeon] = useState(Dungeon(dungeonConfig))

	useSyncStyle(ref, '--highlight', 'highlightColor', 'gold')
	useSyncStyle(ref, '--pathColor', 'pathColor', 'black')
	useSyncStyle(ref, 'width', 'width', '500')
	useSyncStyle(ref, 'min-height', 'minHeight', 'none')

	const x = 0
	const y = 0
	const onSelect = (move) => {
		console.log(move)
	}

	console.log('demo', {dungeon, x, y})

	return html`
		<div class="Box">
			<form>
				<fieldset>
					<legend>Dungeon settings</legend>
					<label
						>Width
						<input
							type="number"
							id="dungeonWidth"
							value=${dungeonConfig.width}
							onInput=${(event) => {
								setDungeonConfig({...dungeonConfig, width: event.target.value})
								setDungeon(Dungeon(dungeonConfig))
							}}
						/>
					</label>
					<label
						>Height
						<input
							type="number"
							id="dungeonHeight"
							value=${dungeonConfig.height}
							onInput=${(event) => {
								setDungeonConfig({...dungeonConfig, height: event.target.value})
								setDungeon(Dungeon(dungeonConfig))
							}}
						/>
					</label>
					<label
						>Min Rooms
						<input
							type="number"
							id="dungeonMinRooms"
							value=${dungeonConfig.minRooms}
							onInput=${(event) => {
								setDungeonConfig({...dungeonConfig, minRooms: event.target.value})
								setDungeon(Dungeon(dungeonConfig))
							}}
					/></label>
					<label
						>Max Rooms
						<input
							type="number"
							id="dungeonMaxRooms"
							value=${dungeonConfig.maxRooms}
							onInput=${(event) => {
								setDungeonConfig({...dungeonConfig, maxRooms: event.target.value})
								setDungeon(Dungeon(dungeonConfig))
							}}
					/></label>
					<br />
					<label>Room Types <input type="text" id="dungeonRoomTypes" /> </label>
					<label>Custom Paths <input type="text" id="dungeonCustomPaths" /> </label>
				</fieldset>
				<fieldset>
					<legend>Styles</legend>
					<label>Highlight color <input type="color" id="highlightColor" /></label>
					<label>Path color <input type="color" id="pathColor" /></label>
					<label>Width <input type="number" id="width" step="20" value="500" /></label>
					<label>Height <input type="number" id="minHeight" step="100" value="0" /></label>
				</fieldset>
			</form>
		</div>

		<${SlayMap}
			ref=${ref}
			dungeon=${dungeon}
			x=${x}
			y=${y}
			onSelect=${onSelect}
			disableScatter=${false}
			debug=${false}
		><//>
	`
}

render(html`<${Demo} />`, document.querySelector('#root'))
