import {html, Component} from '../lib.js'
import gsap from '../animations.js'

export default class SplashScreen extends Component {
	componentDidMount() {
		gsap.from(this.base, {duration: 0.4, autoAlpha: 0, scale: 0.98})
		gsap.to(this.base.querySelector('.Splash-spoder'), {delay: 5, x: 420, y: 60, duration: 3})
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
								<li>Found a saved game. <button autofocus onClick=${props.onContinue}>Continue?</button></li>
								<li><button onClick=${props.onNewGame}>New Game</a></li>
					`
							: html`
							<li><button autofocus onClick=${props.onNewGame}>Play</a></li>
							<li><a class="Button" href="/?debug&tutorial">Tutorial</a></li>
							`}
						<li><a class="Button" href="/collection">Collection</a></li>
						<li><a class="Button" href="/stats">Highscores</a></li>
					</ul>
					<p center>
						<small><a href="/changelog">Changelog</a> & <a href="/manual">Manual</a></small>
					</p>
				</div>
			</article>
		`
	}
}
