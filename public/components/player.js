import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Player extends Component {
	render(props) {
		const name = props.name ? props.name : 'Anonymous'
		const {player} = props
		return html`
			<div class="Player">
				<p>${name}</p>
				<${Energybar} max=${player.maxEnergy} value=${player.currentEnergy} />
				<${Healthbar} max=${player.maxHealth} value=${player.currentHealth} />
			</div>
		`
	}
}

const Energybar = ({max, value}) => html`
	<div class="Energybar"><i>${value}</i> / ${max}</div>
`

const Healthbar = ({max, value}) => html`
	<div class="Healthbar">
		<p>${value} / ${max}</p>
		<div class="Healthbar-value" style=${`width: ${value}%`}></div>
	</div>
`
