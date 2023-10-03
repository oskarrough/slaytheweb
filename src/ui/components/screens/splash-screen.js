import {html, Component} from '../../lib.js'
import VersionInfo from '../version-info.js'
import gsap from '../../animations.js'

export default class SplashScreen extends Component {
	componentDidMount() {
		gsap.from('.Splash--fadein', {duration: 0.4, autoAlpha: 0, scale: 0.98})
		// gsap.from('.Splash--fadein .Options', {
		// 	// delay: 0.1,
		// 	duration: 0.4,
		// 	y: -8,
		// 	autoAlpha: 0,
		// 	scale: 0.5,
		// })
		gsap.to('.Splash-spoder', {delay: 5, x: 420, y: 60, duration: 3})
	}
	render(props) {
		return html`
			<article class="Container Splash--fadein">
				<header class="Header">
					<h1>Slay the Web</h1>
					<h2>A card crawl adventure for you and your browser</h2>
					<img class="Splash-spoder" src="/images/spoder.png" title="Oh hello" />
				</header>
				<div class="Box">
					<ul class="Options">
						${location.hash
							? html`
								<li><button autofocus onClick=${props.onContinue}>Continue Game</button></li>
								<li><button autofocus onClick=${props.onNewGame}>New Game</a></li>
					`
							: html`<li><button autofocus onClick=${props.onNewGame}>Play</a></li>`}
						<li><a class="Button" href="/collection.html">Collection</a></li>
						<li><a class="Button" href="/stats.html">Highscores</a></li>
						<li><a class="Button" href="/manual.html">Manual</a></li>
					</ul>
				</div>
				<${VersionInfo}><//>
			</article>
		`
	}
}
