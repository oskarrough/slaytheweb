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

export function Healthbar({max, value, block}) {
	return html`
		<div class="Healthbar ${block ? `Healthbar--block` : ''}">
			<p class="Healthbar-label">${block ? `[${block}]` : ''} ${value}/${max}</p>
			<div class="Healthbar-bar" style=${`width: ${(value / max) * 100}%`}></div>
		</div>
	`
}
