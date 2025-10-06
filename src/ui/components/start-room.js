import {Component, html} from '../lib.js'

export default class StartRoom extends Component {
	render() {
		return html`
			<div class="Container Container--center">
				<div class="Box">
				<h1 center style="color: black">It begins…</h1>
				<p center>Fight your way through the dungeon, build your deck and defeat the boss at the end.</p>
					<ul class="Options">
						<li><button class="Button" onClick=${() => this.props.onContinue()}>Open the map</button></li>
					</ul>
				</div>
			</div>
		`
	}
}
