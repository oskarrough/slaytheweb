import {html} from './../web_modules/htm/preact/standalone.module.js'

export const Player = props => html`
	<${Target} ...${props} type="player" />
`

export const Monster = props => html`
	<${Target} ...${props} type="enemy" />
`

function Target({model, type, name}) {
	return html`
		<div class="Target" data-type=${type}>
			<h2>${name}</h2>
			<${Healthbar} max=${model.maxHealth} value=${model.currentHealth} block=${model.block} />
			<${Powers} powers=${model.powers} />
		</div>
	`
}

// A bar that shows the player's current and maximum health as well as any block.
function Healthbar({value, max, block}) {
	return html`
		<div class="Healthbar ${block ? `Healthbar--hasBlock` : ''}">
			<p class="Healthbar-label">${block ? `[${block}]` : ''} ${value}/${max}</p>
			<div class="Healthbar-bar" style=${`width: ${(value / max) * 100}%`}></div>
		</div>
	`
}

// Shows currently active powers.
function Powers({powers}) {
	return html`
		${powers.vulnerable > 0 ? `Vulnerable ${powers.vulnerable}` : ''}
		${powers.regen > 0 ? `Regen ${powers.regen}` : ''}
	`
}
