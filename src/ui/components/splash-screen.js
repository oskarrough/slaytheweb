import {html, Component} from '../lib.js'
import gsap from '../animations.js'
import {getRuns} from '../../game/backend.js'

function formatDate(timestamp) {
	return new Intl.DateTimeFormat('en', {
		dateStyle: 'medium',
		// month: 'short',
		// timeStyle: 'short',
		hour12: false,
	}).format(new Date(timestamp))
}

function timeSince(timestamp) {
	const seconds = Math.floor((Date.now() - timestamp) / 1000)
	if (seconds < 60) return 'just now'
	if (seconds < 120) return 'a minute ago'
	if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
	if (seconds < 7200) return 'an hour ago'
	if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
	if (seconds < 172800) return 'yesterday'
	return `${Math.floor(seconds / 86400)} days ago`
}

export default class SplashScreen extends Component {
	constructor() {
		super()
		this.state = {runs: []}
	}

	componentDidMount() {
		getRuns().then(({runs}) => this.setState({runs}))

		gsap.from(this.base, {duration: 0.4, autoAlpha: 0, scale: 0.98})
		gsap.to(this.base.querySelector('.Splash-spoder'), {delay: 5, x: 420, y: 60, duration: 3})
	}

	render(props, state) {
		const run = this.state.runs[0]

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
						<li>
							<a class="Button" href="/stats">Highscores</a>
							${this.state.runs.length > 0 ? html`
							<a class="LastRun" href=${`/stats/run?id=${this.state.runs[0].id}`}>
								${timeSince(this.state.runs[0].createdAt)} someone ${this.state.runs[0].won ? 'won' : 'lost'}
							</a>` : ''}
						</li>
					</ul>
					<p center>
						<a href="/changelog">Changelog</a> & <a href="/manual">Manual</a>
					</p>
				</div>
			</article>
		`
	}
}
