import {html, Component} from '../web_modules/htm/preact/standalone.module.js'

export default class Cards extends Component {
	// props = {gameState: {}, type ''}
	render(props) {
		const cards = props.gameState[props.type]
		return html` <div class="Cards">${cards.map((card) => Card(card, props.gameState))}</div> `
	}
}

export function Card(card, gameState) {
	function canPlayCard(card, gameState) {
		const notEnoughEnergy = gameState && gameState.player.currentEnergy < card.energy
		const cardIsInHand = gameState && gameState.hand.find((c) => c.id === card.id)
		if (!cardIsInHand) return false
		if (notEnoughEnergy) return false
		if (gameState && card.conditions) {
			return card.canPlay(gameState)
		}
		return true
	}
	const isDisabled = !canPlayCard(card, gameState)

	// 500x380
	let image = ''
	if (card.name === 'Strike') image = 'the-angel-of-death.jpg'
	if (card.name === 'Defend') image = 'angel-messenger.jpg'
	if (card.name === 'Bash') image = 'apteryx-mantelli.jpg'
	if (card.name === 'Flourish') image = 'serpentine-dancer.jpg'
	if (card.name === 'Summer of Sam') image = 'bare-feet-of-god.jpg'

	return html`
		<article
			class="Card"
			data-card-type=${card.type}
			data-card-target=${card.target}
			key=${card.id}
			data-id=${card.id}
			disabled=${isDisabled}
		>
			<div class="Card-inner">
				<p class="Card-energy EnergyBadge">
					<span>${card.energy}</span>
				</p>
				<figure class="Card-media">
					<img src=${`/ui/images/cards/` + image} alt=${card.name} />
				</figure>
				<h3 class="Card-name">${card.name}</h3>
				<p class="Card-type">${card.type}</p>
				<p class="Card-description">${card.description}</p>
			</div>
		</article>
	`
}
