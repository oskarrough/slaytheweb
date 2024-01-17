import {html, render} from '../lib.js'
import {cards} from '../../content/cards.js'
import {Card} from './cards.js'
import '../styles/index.css'
import {createCard} from '../../game/cards.js'

const CollectionPage = () => html`
	<article class="Container">
		<header class="Header">
			<h1 medium>Slay the Web</h1>
			<h2>${cards.length} Card Collection</h2>
			<p>Hover each card to see its upgraded version.</p>
		</header>
		<div class="Box">
			<ul class="Options">
				<li><a class="Button" href="/">Back</a></li>
			</ul>
		</div>
		<div class="Box Box--text Box--full">
			<div class="Cards Cards--grid Cards--withUpgrades">
				${cards.map((card) => html`<div>${Card(card)} ${Card(createCard(card.name, true))}</div>`)}
			</div>
		</div>
	</article>
`

render(html`<${CollectionPage} cards=${cards} />`, document.querySelector('#Cards'))
