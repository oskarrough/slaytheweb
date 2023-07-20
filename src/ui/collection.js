import {html, render} from '../../public/web_modules/htm/preact/standalone.module.js'
import cards from '../../public/content/cards.js'
import {Card} from './cards.js'

const Cardss = (props) => html`
	<article class="Splash">
		<p><a href="/" class="Button">Back</a></p>
		<h2>${cards.length} Card Collection</h2>
		<div class="Cards Cards--grid">${cards.map((card) => Card(card))}</div>
	</article>
`

render(html`<${Cardss} cards=${cards} />`, document.querySelector('#Cards'))
