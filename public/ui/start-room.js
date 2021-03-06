import {html, Component} from '../web_modules/htm/preact/standalone.module.js'

export default class StartRoom extends Component {
	render() {
		return html`
			<h1 center medium>Slay the Web</h1>
			<ul class="Options">
				<li><button onclick=${() => this.props.onContinue()}>Proceed</button></li>
			</ul>
			<p center>
				<button onclick=${() => (window.location = window.location.origin)}>Leave the Spire</button>
			</p>
		`
	}
}
