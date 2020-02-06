import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Player extends Component {
	render(props) {
		const {player} = props
		const name = props.name ? props.name : 'Anonymous'
		return html`
			<div class="Player">
				<h2>${name}</h2>
				<${Healthbar} max=${player.maxHealth} value=${player.currentHealth} block=${player.block} />
			</div>
		`
	}
}

const Healthbar = ({max, value, block}) => html`
	<div class="Healthbar">
		<p>${block ? block : ''} ${value}/${max}</p>
		<div class="Healthbar-value" style=${`width: ${(value / max) * 100}%`}></div>
	</div>
`
