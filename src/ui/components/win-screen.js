import {html} from '../lib.js'

const WinScreen = (props) => html`
	<article class="Splash Container">
		<header class="Header">
			<h1>Well done. You won.</h1>
		</header>
		<div class="Box">
			<ul class="Options">
				<li>
					<button autofocus onClick=${props.onNewGame}>Play again</a>
				</li>
			</ul>
		</div>
	</article>
`

export default WinScreen
