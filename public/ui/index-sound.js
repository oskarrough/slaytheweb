import {html, render} from '../web_modules/htm/preact/standalone.module.js'
import {playSound} from './sounds.js'

// the osunds of the library
const SLWSounds = (props) => html`
	<article class="Sounds">
		<h1>Play the sound library.</h1>
		<p><button autofocus onClick=${playSound}>Play sound</a></p>
	</article>
`

render(html` <${SLWSounds}/> `, document.querySelector('#SlayTheWebSounds'))
