import {html, render} from '../lib/lib.js'
import {cards} from '../../../../../src/content/cards.js'
import {Card} from './cards.js'
import '../styles/index.css'

const CollectionPage = () => html`
	<article class="Splash">
		<p><a href="/" class="Button">Back</a></p>
		<h2>${cards.length} Card Collection</h2>
		<div class="Cards Cards--grid">${cards.map((card) => Card(card))}</div>
	</article>
`

render(html`<${CollectionPage} cards=${cards} />`, document.querySelector('#Cards'))
