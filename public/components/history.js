import {html, Component} from './../web_modules/htm/preact/standalone.module.js'

export default class Queue extends Component {
	constructor(props) {
		super(props)
		this.state = {time: Date.now()}
	}
	componentDidMount() {
		// The timer here also makes sure the component renders the newest history.
		this.timer = setInterval(() => {
			this.setState({time: Date.now()})
		}, 500)
	}
	componentWillUnmount() {
		clearInterval(this.timer)
	}
	render(props, state) {
		const time = new Date(state.time).toLocaleTimeString()
		return html`
			<details>
				<summary>Kortgame v0 ${time}</summary>
				<h2>Future</h2>
				<${FutureList} items=${props.future} />
				<h3>Past</h3>
				<${FutureList} items=${props.past} />
			</details>
		`
	}
}

function FutureList({items}) {
	if (!items.length)
		return html`
			<p>nothing yet</p>
		`
	return html`
		<ol>
			${items.map(Item)}
		</ol>
	`
}

function Item(item) {
	return html`
		<li key=${item}>
			${item.action.type} ${item.action.card && item.action.card.name}
		</li>
	`
}
