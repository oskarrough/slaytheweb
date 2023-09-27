import {html, render} from '../lib.js'
import {cards} from '../../content/cards.js'
import {Card} from './cards.js'
import '../styles/index.css'

const CollectionPage = () => html`
	<article class="Container">
		<header class="Header">
			<h1 medium>Slay the Web</h1>
			<h2>${cards.length} Card Collection</h2>
		</header>
		<div class="Box">
			<ul class="Options">
				<li><a class="Button" href="/">Back</a></li>
			</ul>
		</div>
		<div class="Box Box--text Box--full">
			<div class="Cards Cards--grid">${cards.map((card) => Card(card))}</div>
		</div>
	</article>
`

render(html`<${CollectionPage} cards=${cards} />`, document.querySelector('#Cards'))
