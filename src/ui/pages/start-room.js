import {html, Component} from '../lib.js'

export default class StartRoom extends Component {
	render() {
		return html`
			<div class="Container Container--centerRRRR">
				<h1 center>It begins…</h1>
				<h2>with a choice</h2>

				<div class="Box">
					<ul class="Options">
						<li><button onclick=${() => this.props.onContinue()}>View the map</button></li>
					</ul>
				</div>
				<p center>
					<button onclick=${() => (window.location.href = window.location.origin)}>
						Let me out
					</button>
				</p>
			</div>
		`
	}
}
