import {html} from '../lib.js'
import DungeonStats from './dungeon-stats'
import {PublishRun} from './publish-run.js'

export default function WonRoom({game, gameState, onContinue}) {
	return html`
		<div class="Container">
			<h1 center>You won!</h1>
			<${PublishRun} game=${game}><//>
			<${DungeonStats} dungeon=${gameState.dungeon}><//>
			<button onClick=${onContinue}>Continue</button>
		</div>
	`
}
