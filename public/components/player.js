import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Player extends Component {
	render({player}) {
		const name = player.name ? player.name : 'You'
		return html`
			<div class="Player is-cardTarget">
				<h2>${name}</h2>
				<${Healthbar} max=${player.maxHealth} value=${player.currentHealth} block=${player.block} />
				${player.powers.regen > 0 ? `Regen ${player.powers.regen}` : ''}
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

export function Monster(monster) {
	return html`
		<div class="Monster dropzone is-cardTarget">
			<h2>Evil Monster</h2>
			<${Healthbar} max=${monster.maxHealth} value=${monster.currentHealth} />
			${monster.powers.vulnerable > 0 ? `Vulnerable ${monster.powers.vulnerable}` : ''}
		</div>
	`
}
