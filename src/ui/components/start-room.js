import {html, Component} from '../lib.js'
import {DeckSelector} from './deck-selector.js'

export default class StartRoom extends Component {
	render() {
		return html`
			<div class="Container Container--centerRRRR">
				<h1 center>It begins…</h1>
				<p center>Fight your way through the dungeon, build your deck and defeat the boss at the end.</p>
				<div class="Box">
					<ul class="Options">
						<li><button onClick=${() => this.props.onContinue()}>Open the map</button></li>
					</ul>
				</div>
				<p center>
					<a href="/">Let me out</a>
				</p>
			</div>
		`
	}
}
