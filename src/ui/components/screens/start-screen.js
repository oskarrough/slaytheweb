import {html} from '../../lib.js'

/**
 * The very first screen you see AFTER starting a new game, floor 0.
 */
export default function StartRoom(props) {
	return html`
		<div class="Container">
			<h1 center>It begins…</h1>
			<br />
			<div class="Box">
				<ul class="Options">
					<li><button onClick=${props.onContinue}>View the map</button></li>
				</ul>
			</div>
			<p center>
				<a href="/">Let me out</a>
			</p>
		</div>
	`
}
