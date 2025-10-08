import {createCard} from '../../game/cards.js'
import gsap from '../animations.js'
import {Component, html} from '../lib.js'
import {Card} from './cards.js'

export default class CardChooser extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedIndex: null,
		}
	}

	componentDidMount() {
		if (this.props.animate) {
			// Animate all the cards in with a nice animation and staggered delay with gsap
			const cards = this.base.querySelectorAll('.CardBox')
			gsap.effects.dealCards(cards)
		}
	}

	handleCardClick(index) {
		this.setState({
			selectedIndex: this.state.selectedIndex === index ? null : index,
		})
	}

	handleButtonClick() {
		const {selectedIndex} = this.state
		if (selectedIndex === null) return

		const card = this.props.cards[selectedIndex]
		const cardEl = this.base.querySelector(`[data-id="${card.id}"]`)

		setTimeout(() => {
			this.props.didSelectCard(card)
		}, 300)

		gsap.effects.addCardToDeck(cardEl)
	}

	render(props, state) {
		const {selectedIndex} = state
		const hasUpgrades = props.showUpgrades !== false && props.cards.some((card) => !card.upgraded)
		const showButton = props.buttonLabel !== undefined

		console.log('CardChooser:', {
			cardsLength: props.cards.length,
			cards: props.cards.map((c) => ({name: c.name, upgraded: c.upgraded})),
			hasUpgrades,
			showButton,
		})

		return html`
			<article class="RewardsBox">
				<div class="Cards ${hasUpgrades ? 'Cards--withUpgrades' : ''}">
					${props.cards.map(
						(card, index) =>
							html`<div
								class="CardBox"
								selected=${selectedIndex === index ? '' : null}
								flipped=${hasUpgrades && selectedIndex === index ? '' : null}
								onClick=${() => this.handleCardClick(index)}
							>
								${Card({card, gameState: props.gameState})}
								${hasUpgrades && Card({card: createCard(card.name, true), gameState: props.gameState})}
							</div>`,
					)}
				</div>
				${
					showButton &&
					html`
					<p center>
						${props.cancelButton}
						<button
							class="Button Button--primary"
							disabled=${selectedIndex === null}
							onClick=${() => this.handleButtonClick()}
						>
							${props.buttonLabel}
						</button>
					</p>
				`
				}
			</article>
		`
	}
}
