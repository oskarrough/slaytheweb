import {html, Component} from '../lib.js'

export default class StartRoom extends Component {
	render() {
		return html`
			<div class="Container Container--centerRRRR">
				<h1 center>It begins…</h1>
				<br/>
				<div class="Box">
					<ul class="Options">
						<li><button onclick=${() => this.props.onContinue()}>View the map</button></li>
					</ul>
				</div>
				<p center>
					<a href="/">Let me out</a>
				</p>
			</div>
		`
	}
}
