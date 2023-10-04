import {getCurrRoom} from '../../../game/utils-state'
import {html} from '../../lib'
import Cards from '../cards.js'
import {Player, Monster} from '../player.js'

/**
 * The screen to render when you're on a "monster" node.
 * @param {object} props
 * @param {import('../../../game/actions').State} props.gameState
 * @param {function} props.onEndTurn
 * @returns {import('preact').VNode}
 */
export default function CombatScreen({gameState: state, onEndTurn}) {
	const noEnergy = !state.player.currentEnergy
	const room = getCurrRoom(state)

	return html`
		<div class="Targets Split">
			<div class="Targets-group">
				<${Player} model=${state.player} name="Player" />
			</div>
			<div class="Targets-group">
				${room.monsters.length &&
				room.monsters.map((monster) => html`<${Monster} model=${monster} gameState=${state} />`)}
			</div>
		</div>

		<div class="Split ${noEnergy ? 'no-energy' : ''}">
			<div class="EnergyBadge">
				<span
					class="tooltipped tooltipped-e tooltipped-multiline"
					aria-label="Cards costs energy and this badge shows how much you have left this turn. Next turn your energy is refilled."
					>${state.player.currentEnergy}/${state.player.maxEnergy}</span
				>
			</div>
			<p class="Actions">
				<button class="EndTurn" onClick=${onEndTurn}><u>E</u>nd turn</button>
			</p>
		</div>

		<div class="Hand">
			<${Cards} gameState=${state} type="hand" />
		</div>
	`
}
