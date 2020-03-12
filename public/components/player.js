import {html} from './../web_modules/htm/preact/standalone.module.js'

export function Healthbar({max, value, block}) {
	return html`
		<div class="Healthbar ${block ? `Healthbar--hasBlock` : ''}">
			<p class="Healthbar-label">${block ? `[${block}]` : ''} ${value}/${max}</p>
			<div class="Healthbar-bar" style=${`width: ${(value / max) * 100}%`}></div>
		</div>
	`
}

export function Player({player}) {
	const name = player.name ? player.name : 'You'
	return html`
		<div class="Target Player dropzone is-cardTarget">
			<h2>${name}</h2>
			<${Healthbar} max=${player.maxHealth} value=${player.currentHealth} block=${player.block} />
			${player.powers.regen > 0 ? `Regen ${player.powers.regen}` : ''}
		</div>
	`
}

export function Monster(monster) {
	return html`
		<div class="Target Monster dropzone is-cardTarget">
			<h2 align-right>Evil Monster</h2>
			<${Healthbar} max=${monster.maxHealth} value=${monster.currentHealth} />
			${monster.powers.vulnerable > 0 ? `Vulnerable ${monster.powers.vulnerable}` : ''}
		</div>
	`
}
