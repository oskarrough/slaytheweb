import {html} from './lib.js'

const WinScreen = (props) => html`
	<article class="Splash">
		<h1>Well done. You won.</h1>
		<p><button autofocus onClick=${props.onNewGame}>Play again</a></p>
	</article>
`

export default WinScreen
