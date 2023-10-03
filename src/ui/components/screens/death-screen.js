import {html} from '../../lib.js'
import DungeonStats from '../dungeon-stats.js'
import {PublishRun} from '../publish-run.js'

export default function DeathRoom({game, gameState, onContinue}) {
	return html`
		<div class="Container">
			<h1 center>You are dead</h1>
			<${PublishRun} game=${game}><//>
			<${DungeonStats} dungeon=${gameState.dungeon}><//>
			<button onClick=${onContinue}>Try again?</button>
		</div>
	`
}
