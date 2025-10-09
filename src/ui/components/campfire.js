import {isCurrRoomCompleted} from '../../game/utils-state.js'
import {pick} from '../../utils.js'
import {Component, html} from '../lib.js'
import CardChooser from './card-chooser.js'

export default class CampfireRoom extends Component {
	rest() {
		this.props.onChoose('rest')
	}
	choose(choice, reward) {
		this.setState({
			choice,
			reward,
			isChoosingCard: !this.state.isChoosingCard,
		})
		if (reward) {
			this.props.onChoose(choice, reward)
		}
	}
	onSelectCard(card) {
		this.choose(this.state.choice, card)
	}
	render(props, state) {
		const {gameState} = props
		const {choice, isChoosingCard} = state
		let label = ''
		if (isCurrRoomCompleted(gameState)) {
			return html`
			<div class="Container Container--center">
				<h1 center>You've already made a choice</h1>
				<p center>
					<button class="Button" onClick=${props.onContinue}>Continue to the next room</button>
				</p>
			</div>
		`
		}

		if (choice === 'upgradeCard') label = 'Choose a card to upgrade'
		if (choice === 'removeCard') label = 'Choose a card to remove'
		return html`
			<div class="Container Container--center">
				<h1 center>Campfire</h1>
				<h2 center>${pick(campfireIntroTexts)}</h2>
				<div class="Box">
					<ul class="Options">
						${
							isChoosingCard
								? html`
									<li>
										<button class="Button" onClick=${() => this.setState({isChoosingCard: false})}>Cancel</button>
									</li>
								`
								: html`
									<li><button class="Button" onClick=${() => this.rest()}>Rest</button></li>
									<li><button class="Button" onClick=${() => this.choose('upgradeCard')}>Upgrade card</button></li>
									<li><button class="Button" onClick=${() => this.choose('removeCard')}>Remove card</button></li>
								`
						}
					</ul>
				</div>
				${
					isChoosingCard &&
					html`<br />
					<p center>${label}</p>
					<${CardChooser}
						gameState=${gameState}
						cards=${gameState.deck.filter((card) => !card.upgraded)}
						didSelectCard=${(card) => this.onSelectCard(card)}
						buttonLabel="Upgrade"
					/>`
				}
				${
					!isChoosingCard &&
					html`<p center>
						<button class="Button" onClick=${() => this.props.onContinue()}>No, thanks</button>
					</p>`
				}
			</div>
		`
	}
}

const campfireIntroTexts = [
	"The fire's warmth beckons. Rest now, and reclaim your strength for what comes next.",
	"A glowing campfire invites you to rest. Your stamina's just as vital as your deck.",
	"The firelight shines on your cards. Perfect time to hone their power, don't you think?",
	"Campfire's blaze illuminates your deck. Could an upgrade tip the next battle in your favor?",
	"Sitting by the fire, you ponder your deck. Perhaps it's time to let go of a card.",
	'The fire flickers as you sift through your cards. Sometimes less is more.',
	'Campfire ahead. A rare moment of peace. How will you seize it?',
	'Firelight glows on your cards. Each choice here could be the edge you need.',
]
