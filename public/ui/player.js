import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export const Player = (props) => html` <${Target} ...${props} type="player" /> `

export const Monster = (props) => {
	const intent = props.model.intents[props.model.nextIntent]
	const type = intent && Object.keys(intent)[0]
	const damage = intent && intent.damage
	return html`
		<${Target} ...${props} type="enemy">
			${intent &&
			html`
				<div class="Target-intent"><img alt=${type} src="ui/images/${type}.png" /> ${damage}</div>
			`}
		<//>
	`
}

class Target extends Component {
	componentDidUpdate(prevProps) {
		// Keep track of how much hp we might have lost.
		const oldHp = prevProps.model.currentHealth
		const currHp = this.props.model.currentHealth
		const lostHealth = oldHp - currHp
		if (currHp < oldHp) this.setState({lostHealth})
	}
	render({model, type, name, children}, state) {
		const isDead = model.currentHealth < 1
		const hp = isDead ? 0 : model.currentHealth
		return html`
			<div class=${`Target${isDead ? ' Target--isDead' : ''}`} data-type=${type}>
				<h2>${name} ${children}</h2>
				<${Healthbar} max=${model.maxHealth} value=${hp} block=${model.block} />
				<${Powers} powers=${model.powers} />
				<div class="Split">
					<${FCT} key=${model.block} value=${model.block} class="FCT FCT--block" />
					<${FCT} key=${hp} value=${state.lostHealth} />
				</div>
			</div>
		`
	}
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
		<p>
			${powers.vulnerable > 0 ? `Vulnerable ${powers.vulnerable}` : ''}
			${powers.regen > 0 ? `Regen ${powers.regen}` : ''}
			${powers.weak > 0 ? `Weak ${powers.weak}` : ''}
		</p>
	`
}

// Floating Combat Text
function FCT(props) {
	if (!props.value) return html`<p></p>`
	return html`<p class="FCT" ...${props}>${props.value}</p>`
}
