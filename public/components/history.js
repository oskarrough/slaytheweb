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
			<details open>
				<summary>Kortgame v0 ${time}</summary>
				<h2>Queue</h2>
				<ol>
					${props.future.map(HistoryItem)}
				</ol>
				<hr />
				<h3>History</h3>
				<ol>
					${props.past.map(HistoryItem)}
				</ol>
			</details>
		`
	}
}

function HistoryItem(item) {
	const cardDetails =
		item.type === 'playCard'
			? html`
					: ${item.card.name}
			  `
			: ''
	return html`
		<li key=${item}>
			${item.type} ${cardDetails}
		</li>
	`
}
