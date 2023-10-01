import {html} from '../lib.js'
import {pick} from '../../utils.js'
import {getCardRewards} from '../../game/cards.js'
import CardChooser from './card-chooser.js'

/**
 *
 * @param {object} props
 * @prop {function} props.onSelectCard
 * @prop {object} props.gameState
 * @returns {import('preact').VNode}
 */
export default function VictoryRoom(props) {
	return html`
		<div class="Container Container--center">
			<h1 center>Victory. Onwards!</h1>
			<h2 center>${pick(victoryRoomIntroTexts)}</h2>
			${!props.gameState.didPickCard &&
			html`
				<${CardChooser}
					animate
					cards=${getCardRewards(3)}
					didSelectCard=${(card) => props.handlePlayerReward('addCard', card)}
				/>
			`}
			<ul class="Options">
				<button onClick=${props.onContinue}>Continue to the next room</button>
			</ul>
		</div>
	`
}

const victoryRoomIntroTexts = [
	'A win under your belt and new cards on the table. Pick wisely.',
	"Victory's sweet, but a new card? Sweeter.",
	'Monster down, morale up.',
	"Ah, the smell of defeat! Now, how 'bout we celebrate with some fresh cardboard?",
	'Sure, you could skip the rewards. You could also go to a restaurant and just eat bread.',
	"You've slain, now you gain. What's it gonna be, hero?",
	"Ah, victory! Don't linger too long; those cards won't pick themselves.",
	'Where the cards are your oyster',
	'Choose a card, any card!',
	"Rewards await. But remember, a deck can't thrive on clutter.",
	"Ah, the Victory Room, where today's choices are tomorrow's victories or, you know, defeats.",
	"New cards up for grabs. Don't underestimate the power of fresh cardboard.",
]
