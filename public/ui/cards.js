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
	let image = 'codices.jpg'
	if (card.name === 'Strike') image = 'the-angel-of-death.jpg'
	if (card.name === 'Defend') image = 'angel-messenger.jpg'
	if (card.name === 'Bash') image = 'apteryx-mantelli.jpg'
	if (card.name === 'Flourish') image = 'serpentine-dancer.jpg'
	if (card.name === 'Summer of Sam') image = 'bare-feet-of-god.jpg'
	if (card.name === '') image = 'codices.jpg'
	if (card.name === 'Iron Wave') image = 'henry-stares-back.jpg'
	if (card.name === 'Cleave') image = 'vernal-equinox.jpg'
	if (card.name === '') image = 'alice-holds-the-white-king.jpg'
	if (card.name === '') image = '3.jpg'
	if (card.name === 'Thunderclap') image = 't.jpg'
	if (card.name === '') image = 'poured-millions-of-bubbles.jpg'
	if (card.name === '') image = 'railway-trains-in-space.jpg'
	if (card.name === 'Sucker Punch') image = 'manicule.jpg'
	if (card.name === 'Clash') image = 'h-sperling-horrified.jpg'
	image = `/ui/images/cards/${image}`

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
					<img src=${image} alt=${card.name} />
				</figure>
				<h3 class="Card-name">${card.name}</h3>
				<p class="Card-type">${card.type}</p>
				<p class="Card-description">${card.description}</p>
			</div>
		</article>
	`
}
